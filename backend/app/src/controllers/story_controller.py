import os
import io
import re
import base64
import requests
import traceback

from .. import db
from .. import limiter, logger
from ..models.story_model import Story

from flask import request, Response, json, Blueprint, send_file
from flask_jwt_extended import jwt_required, get_jwt
from flask_limiter.errors import RateLimitExceeded

from openai import AzureOpenAI
from openai import BadRequestError
import azure.cognitiveservices.speech as speechsdk
from pydub import AudioSegment
from weasyprint import HTML
from io import BytesIO

story = Blueprint("story", __name__)
IMAGE_SAVE_PATH = os.path.join(os.getcwd(), "assets", "images")
AUDIO_SAVE_PATH = os.path.join(os.getcwd(), "assets", "audios")

def rate_limit_exceeded_handler(e: RateLimitExceeded):
    response = {
        "status": "fail",
        "message": "Only one trial story per day is allowed."
    }
    return Response(response=json.dumps(response), status=429, mimetype="application/json")

def process_story(input_text):
    # Regex to match the title (assumes title is enclosed by **)
    title_pattern = r'^\*\*(.*?)\*\*'
    title_match = re.search(title_pattern, input_text, re.MULTILINE)
    
    # Extract the title
    title = title_match.group(1).strip() if title_match else None
    
    # Regex to match the story (everything after the title)
    story_pattern = r'^\*\*.*?\*\*\n(.*)$'
    story_match = re.search(story_pattern, input_text, re.DOTALL)
    
    # Extract the story content
    story = story_match.group(1).strip() if story_match else None
    
    # Split story into paragraphs (assuming paragraphs are separated by newlines)
    paragraphs = [para.strip() for para in story.split('\n') if para.strip()] if story else []
    
    return title, paragraphs


@story.route("/generate-partial", methods=["POST"])
@limiter.limit("1 per day", on_breach=rate_limit_exceeded_handler)
def generate_partial():
    try:
        data = request.get_json()
        logger.debug(f"Request Headers: {request.headers}")
        child_age = data.get("child_age")
        child_name = data.get("child_name")
        story_moral = data.get("story_moral")
        story_genre = data.get("story_genre")

        if not child_age or not child_name or not story_moral or not story_genre:
            return Response(response=json.dumps({
                "message": "One or more required fields are missing",
                "status": "fail"
            }), status=400, mimetype="application/json")

        chat_client = AzureOpenAI(
            azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
            api_key = os.getenv("AZURE_OPENAI_API_KEY"), 
            api_version = os.getenv("AZURE_OPENAI_CHAT_API_VERSION")
        )

        chat_response = chat_client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_CHAT_MODEL_NAME"),
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a skilled and imaginative children's story writer who crafts engaging, age-appropriate stories designed to delight and educate. "
                        "You will be provided with specific details formatted as follows:\n\n"
                        "Child age: <Age>\nChild name: <Name>\nStory moral: <Moral>\nStory genre: <Genre>\nStory length: <Length>\n\n"
                        "Your task is to write a story based on the provided details. The story must strictly adhere to the following requirements:\n\n"
                        "1. **Suitability**: Ensure the story is appropriate for the specified age, using language and themes that the child can easily understand.\n"
                        "2. **Personalization**: Incorporate the child's name naturally and meaningfully within the narrative.\n"
                        "3. **Moral**: Clearly convey the specified moral in a way that resonates with the child.\n"
                        "4. **Genre**: Follow the specified genre, integrating its typical elements, tone, and style.\n"
                        "5. **Length**: Adhere to the specified story length, ensuring the narrative fits within the given word count constraints (500 words for a short story).\n"
                        "6. **Structure**: Format the response exactly as follows:\n"
                        "   - The **title** on the first line, prefixed and suffixed with `**` (e.g., **Title**).\n"
                        "   - From the second line onward, write the story in paragraphs.\n\n"
                        "Ensure all instructions are followed precisely. Avoid adding any extra content, commentary, or formatting outside the specified structure."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"Child age: {child_age}\n"
                        f"Child name: {child_name}\n"
                        f"Story moral: {story_moral}\n"
                        f"Story genre: {story_genre}\n"
                        f"Story length: short story with 500 words\n"
                    )
                }
            ]
        )

        chat_response = chat_response.choices[0].message.content
        logger.debug(f"Chat Response: {chat_response}")
        title, story = process_story(chat_response)

        return Response(response=json.dumps({
            "status": "success",
            "message": "Story generated successfully",
            "story": {
                "title": title,
                "content": "\n".join(story[:2]),
                "type": "partial",
            }
        }), status=200, mimetype="application/json")


    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@story.route("/generate", methods=["POST"])
@jwt_required()
def generate():
    try:
        data = request.get_json()
        child_age = data.get("child_age")
        child_name = data.get("child_name")
        story_moral = data.get("story_moral")
        story_genre = data.get("story_genre")
        story_length = data.get("story_length")

        story_word_count = {
            "short": "2000 words",
            "medium": "5000 words",
            "long": "7500 words"
        }

        claims = get_jwt()
        user_id = claims.get("sub")

        if not child_age or not child_name or not story_moral or not story_genre or not story_length:
            return Response(response=json.dumps({
                "message": "One or more required fields are missing",
                "status": "fail"
            }), status=400, mimetype="application/json")

        chat_client = AzureOpenAI(
            azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
            api_key = os.getenv("AZURE_OPENAI_API_KEY"), 
            api_version = os.getenv("AZURE_OPENAI_CHAT_API_VERSION")
        )

        image_client = AzureOpenAI(
            azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
            api_key = os.getenv("AZURE_OPENAI_API_KEY"), 
            api_version = os.getenv("AZURE_OPENAI_IMAGE_API_VERSION")
        )

        # chat_response = chat_client.chat.completions.create(
        #     model = os.getenv("AZURE_OPENAI_CHAT_MODEL_NAME"),
        #     messages=[
        #         {
        #             "role": "system",
        #             "content": 
        #                 f"You are a skilled and imaginative children's story writer who creates engaging, age-appropriate stories that delight and educate. You will receive specific details formatted as follows: \nChild age: <Age>\nChild name: <Name>\nStory moral: <Moral>\nStory genre: <Genre>\nStory length: <Length>\n\nYour task is to write a {story_length} length story containing {story_word_count[story_length]} for children based on this information. Ensure that the story is:\n- Suitable for a child of the specified age, using language and themes they can understand.\n- Incorporates the child's name naturally and meaningfully in the narrative.\n- Clearly conveys the specified moral in a way that resonates with the child.\n- Adheres to the specified genre, incorporating its typical elements and tone.\n- Follows the specified length, providing a complete and satisfying narrative within the given constraints.\n- Please ensure all instructions are carefully followed and the story remains enjoyable and inspiring.\n\nStructure the response strictly as follows with no other sentences beside the required response. The first line with only the title as **Title** and front the second line onwards, the story paragraphs.
        #         },
        #         {
        #             "role": "user",
        #             "content":
        #                 f"Child age: {child_age}\nChild name: {child_name}\nStory moral: {story_moral}\nStory genre: {story_genre}\nStory length: {story_length} story with {story_word_count[story_length]}\n"
        #         }
        #     ]
        # )

        chat_response = chat_client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_CHAT_MODEL_NAME"),
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a skilled and imaginative children's story writer who crafts engaging, age-appropriate stories designed to delight and educate. "
                        "You will be provided with specific details formatted as follows:\n\n"
                        "Child age: <Age>\nChild name: <Name>\nStory moral: <Moral>\nStory genre: <Genre>\nStory length: <Length>\n\n"
                        "Your task is to write a story based on the provided details. The story must strictly adhere to the following requirements:\n\n"
                        "1. **Suitability**: Ensure the story is appropriate for the specified age, using language and themes that the child can easily understand.\n"
                        "2. **Personalization**: Incorporate the child's name naturally and meaningfully within the narrative.\n"
                        "3. **Moral**: Clearly convey the specified moral in a way that resonates with the child.\n"
                        "4. **Genre**: Follow the specified genre, integrating its typical elements, tone, and style.\n"
                        f"5. **Length**: Adhere to the specified story length, ensuring the narrative fits within the given word count constraints ({story_word_count[story_length]} words for a {story_length} story).\n"
                        "6. **Structure**: Format the response exactly as follows:\n"
                        "   - The **title** on the first line, prefixed and suffixed with `**` (e.g., **Title**).\n"
                        "   - From the second line onward, write the story in paragraphs.\n\n"
                        "Ensure all instructions are followed precisely. Avoid adding any extra content, commentary, or formatting outside the specified structure."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"Child age: {child_age}\n"
                        f"Child name: {child_name}\n"
                        f"Story moral: {story_moral}\n"
                        f"Story genre: {story_genre}\n"
                        f"Story length: {story_length} story with {story_word_count[story_length]} words\n"
                    )
                }
            ]
        )

        chat_response = chat_response.choices[0].message.content
        logger.debug(f"Chat Response: {chat_response}")
        title, story = process_story(chat_response)
        # story = chat_response.split("Story: ")[1].strip().split("\n")
        # story = [line.strip() for line in story if line.strip() != ""]
        # title = chat_response.split("Title: ")[1].split("\n")[0].strip()

        image_response = image_client.images.generate( 
            model = os.getenv("AZURE_OPENAI_IMAGE_MODEL_NAME"), 
            prompt = f"""
            Create a vibrant, whimsical illustration suitable for a children short story titled "{title}" with the following specifications:
            * Style: Hand-drawn digital art, soft edges, bright cheerful colors
            * Composition: Centered main subject, clear foreground and background
            * Lighting: Friendly with soft shadows
            * Mood: {story_genre} atmosphere that captures {story_moral}
            * Details: Clean, simple shapes, rounded edges, child-friendly design
            * Important: NO text, NO words, NO letters, NO numbers anywhere in the image
            * Focus: Create an engaging scene that tells the story visually without any written elements
            * Target audience: Age-appropriate imagery for {child_age}-year-old children
            """.strip(),
        )

        image_url = image_response.data[0].url
        image = requests.get(image_url).content

        new_story = Story(
            user_id = user_id,
            title = title,
            content = "\n".join(story),
            customization = {
                "child_age": child_age,
                "child_name": child_name,
                "story_moral": story_moral,
                "story_genre": story_genre,
                "story_length": story_length
            }
        )

        db.session.add(new_story)
        db.session.commit()

        image_filename = f"{new_story.id}.png"
        image_path = os.path.join(IMAGE_SAVE_PATH, image_filename)
        with open(image_path, "wb") as f:
            f.write(image)

        return Response(response=json.dumps({
            "status": "success",
            "message": "Story generated successfully",
            "story": {
                "id": new_story.id,
                "title": new_story.title,
                "content": new_story.content,
                "image": image_filename,
                "type": "full",
            }
        }), status=201, mimetype="application/json")

    except IndexError:
        print(chat_response)
        return Response(response=json.dumps({
            "message": "Unexpected response from AI, please try again. Try changing the parameters.",
            "status": "fail"
        }), status=500, mimetype="application/json")

    except BadRequestError as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e.error.message)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

    except Exception as e:
        error_traceback = traceback.format_exc()
        print(error_traceback)

        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@story.route("/<story_id>", methods=["GET"])
@jwt_required()
def get_story(story_id):
    try:
        story = Story.query.filter_by(id=story_id).first()
        user_id = get_jwt().get("sub")
        if not story or str(story.user_id) != user_id:
            return Response(response=json.dumps({
                "message": "Story not found or unauthorized",
                "status": "fail"
            }), status=404, mimetype="application/json")

        return Response(response=json.dumps({
            "status": "success",
            "message": "Story retrieved successfully",
            "story": {
                "title": story.title,
                "content": story.content,
                "image": f"{story.id}.png",
                "timestamp": story.timestamp
            }
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@story.route("/publish/<story_id>", methods=["POST"])
@jwt_required()
def publish_story(story_id):
    try:
        story = Story.query.filter_by(id=story_id).first()
        user_id = get_jwt().get("sub")
        if not story or str(story.user_id) != user_id:
            return Response(response=json.dumps({
                "message": "Story not found or unauthorized",
                "status": "fail"
            }), status=404, mimetype="application/json")

        if not story.isPublished:
            story.isPublished = True
            db.session.commit()

        return Response(response=json.dumps({
            "status": "success",
            "message": "Story published successfully",
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@story.route("/shared/<story_id>", methods=["GET"])
def get_shared_story(story_id):
    try:
        story = Story.query.filter_by(id=story_id).first()
        if not story or story.isPublished == False:
            return Response(response=json.dumps({
                "message": "Story not found or not shared publicly",
                "status": "fail"
            }), status=404, mimetype="application/json")

        return Response(response=json.dumps({
            "status": "success",
            "message": "Story retrieved successfully",
            "story": {
                "title": story.title,
                "content": story.content,
                "image": f"{story.id}.png"
            }
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@story.route("/my-stories", methods=["GET"])
@jwt_required()
def my_stories():
    try:
        claims = get_jwt()
        user_id = claims.get("sub")

        user_stories = Story.query.filter_by(user_id=user_id).all()
        stories = []

        for story in user_stories:
            stories.append({
                "id": story.id,
                "title": story.title,
                "content": story.content[:100] + "...",
                "image": f"{story.id}.png",
                "timestamp": story.timestamp
            })

        return Response(response=json.dumps({
            "status": "success",
            "message": "Stories retrieved successfully",
            "stories": stories
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

def get_image_as_base64(image_path):
    try:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode("utf-8")
    except Exception:
        return None

@story.route("/download/<story_id>", methods=["GET"])
def download_story_pdf(story_id):
    try:
        story_record = Story.query.filter_by(id=story_id).first()
        if not story_record:
            return Response(response=json.dumps({
                "message": "Story not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        story = {
            "title": story_record.title,
            "content": story_record.content,
        }

        image_filename = f"{story_record.id}.png"
        image_path = os.path.join(IMAGE_SAVE_PATH, image_filename)
        logo_path = os.path.join(os.getcwd(), "app", "src", "brand-logo.png")
        logo_base64 = get_image_as_base64(logo_path)
        image_base64 = get_image_as_base64(image_path)

        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                @page {{
                    margin: 1cm;
                    size: A4;
                    @bottom-right {{
                        content: counter(page);
                        font-family: 'Nunito Sans', sans-serif;
                        color: #333;
                    }}
                    @bottom-center {{
                        content: "Story Generated with Kids Stories (https://kids-stories.net)";
                        font-family: 'Nunito Sans', sans-serif;
                        color: #333;
                    }}
                }}
                @font-face {{
                    font-family: 'Nunito Sans';
                    src: url(file://../NunitoSans.ttf);
                }}
                body {{
                    font-family: 'Nunito Sans', sans-serif;
                    margin: 20px;
                    line-height: 1.8;
                    color: #333;
                }}
                header footer {{
                    font-family: 'Nunito Sans', sans-serif;
                    position: fixed;
                    left: 0;
                    right: 0;
                }}
                .logo-image {{
                    width: 50%;
                    display: block;
                    margin: 0 auto;
                }}
                .story-image {{
                    width: 60%;
                    display: block;
                    margin: 20px auto;
                    border-radius: 10px;
                }}
                h1 {{
                    text-align: center;
                    color: rgb(65, 65, 65);
                    font-size: 1.5em;
                    margin-bottom: 10px;
                    font-weight: 700;
                }}
                .content {{
                    margin-top: 30px;
                    font-size: 1.1em;
                    text-align: justify;
                }}
            </style>
        </head>
        <body>
            <a href="https://kids-stories.net" target="_blank">
            <img src="data:image/png;base64,{logo_base64}" alt="Brand Logo" class="logo-image" /></a>
            <h1>{story["title"]}</h1>
            <img src="data:image/jpeg;base64,{image_base64}" alt="Story Image" class="story-image" />
            <div class="content">
                {"<p>" + "</p><p>".join(story["content"].split("\n")) + "</p>"}
            </div>
        </body>
        </html>
        """

        pdf_io = BytesIO()
        HTML(string=html_template).write_pdf(pdf_io)
        pdf_io.seek(0)

        return send_file(
            pdf_io,
            as_attachment=True,
            download_name=f"story_{story_id}.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@story.route("/narrate/<story_id>", methods=["POST"])
def narrate_story(story_id):
    try:
        fetch_story = Story.query.filter_by(id=story_id).first()
        if not fetch_story:
            return Response(response=json.dumps({
                "message": "Story not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        if fetch_story.narrationData:
            return Response(response=json.dumps({
                "status": "success",
                "message": "Story already narrated",
                "audio": fetch_story.narrationData["audio"],
                "durations": fetch_story.narrationData["durations"]
            }), status=200, mimetype="application/json")

        story = {
            "title": fetch_story.title,
            "content": fetch_story.content.strip().split("\n")
        }

        speech_config = speechsdk.SpeechConfig(
            subscription=os.getenv("AZURE_SPEECH_API_KEY"), 
            region=os.getenv("AZURE_SPEECH_API_REGION")
        )
        speech_config.speech_synthesis_voice_name = 'en-US-AvaMultilingualNeural'
        
        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)

        temp_audios = []
        durations = []

        for para in story["content"]:
            result = speech_synthesizer.speak_text_async(para).get()
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                audio_data = result.audio_data
                temp_audios.append(audio_data)

                audio = AudioSegment.from_file(io.BytesIO(audio_data), format="wav")
                durations.append(len(audio) / 1000)
            else:
                raise Exception(f"Speech synthesis failed for paragraph: {para}")

        final_audio = AudioSegment.silent(duration=0)
        for audio in temp_audios:
            final_audio += AudioSegment.from_file(io.BytesIO(audio), format="wav")

        audio_io = BytesIO()
        final_audio.export(audio_io, format="wav")
        audio_io.seek(0)

        audio_filename = f"{story_id}.wav"
        audio_path = os.path.join(AUDIO_SAVE_PATH, audio_filename)

        print(audio_path)

        with open(audio_path, "wb") as f:
            f.write(audio_io.getvalue())

        narration_data = {
            "audio": audio_filename,
            "durations": durations
        }

        fetch_story.narrationData = narration_data
        db.session.commit()

        return Response(response=json.dumps({
            "status": "success",
            "message": "Story narrated successfully",
            "audio": audio_filename,
            "durations": durations
        }), status=201, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")