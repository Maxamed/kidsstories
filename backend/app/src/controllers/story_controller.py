import os
import io
import base64
import requests
import traceback

from .. import db
from .. import limiter
from ..models.story_model import Story

from flask import request, Response, json, Blueprint, send_file
from flask_jwt_extended import jwt_required, get_jwt
from flask_limiter.errors import RateLimitExceeded

from requests_toolbelt import MultipartEncoder

from openai import AzureOpenAI
from openai import BadRequestError
import azure.cognitiveservices.speech as speechsdk
from pydub import AudioSegment
from weasyprint import HTML
from io import BytesIO

story = Blueprint("story", __name__)
IMAGE_SAVE_PATH = os.path.join(os.getcwd(), "assets", "images")

def story_image_filename(user_id, title):
    return f"{user_id}_{title.lower().replace(' ', '_')}.png"

def rate_limit_exceeded_handler(e: RateLimitExceeded):
    response = {
        "status": "fail",
        "message": "Only one trial story per day is allowed."
    }
    return Response(response=json.dumps(response), status=429, mimetype="application/json")

@story.route("/generate-partial", methods=["POST"])
@limiter.limit("1 per day", on_breach=rate_limit_exceeded_handler)
def generate_partial():
    try:
        data = request.get_json()
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
            model = os.getenv("AZURE_OPENAI_CHAT_MODEL_NAME"),
            messages = [
                {
                    "role": "system",
                    "content": "You are a short story writer for children. You will be given the following information formatted like this: \nChild age: <Age>\nChild name: <Name>, Story moral: <Moral>, Story genre: <Genre>. Please write a short story for children based on this information and incorporate the child name, moral and genre in the story. The story should be suitable for the age of the child provided. Return the story in the following format: \nTitle: <Title>\nStory: <Story>"
                },
                {
                    "role": "user",
                    "content": f"Child age: {child_age}\nChild name: {child_name}, Story moral: {story_moral}, Story genre: {story_genre}"
                }
            ]
        )

        chat_response = chat_response.choices[0].message.content
        story = chat_response.split("Story: ")[1].strip().split("\n")
        story = [line.strip() for line in story if line.strip() != ""]
        title = chat_response.split("Title: ")[1].split("\n")[0].strip()

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

        chat_response = chat_client.chat.completions.create(
            model = os.getenv("AZURE_OPENAI_CHAT_MODEL_NAME"),
            messages = [
                {
                    "role": "system",
                    "content": f"You are a {story_length} story writer for children. You will be given the following information formatted like this: \nChild age: <Age>\nChild name: <Name>, Story moral: <Moral>, Story genre: <Genre>. Please write a {story_length} story for children based on this information and incorporate the child name, moral and genre in the story. The story should be suitable for the age of the child provided. Return the story in the following format: \nTitle: <Title>\nStory: <Story>. Follow the return pattern provided properly."
                },
                {
                    "role": "user",
                    "content": f"Child age: {child_age}\nChild name: {child_name}, Story moral: {story_moral}, Story genre: {story_genre}"
                }
            ]
        )

        chat_response = chat_response.choices[0].message.content
        story = chat_response.split("Story: ")[1].strip().split("\n")
        story = [line.strip() for line in story if line.strip() != ""]
        title = chat_response.split("Title: ")[1].split("\n")[0].strip()

        image_response = image_client.images.generate(
            model = os.getenv("AZURE_OPENAI_IMAGE_MODEL_NAME"),
            prompt = f"Generate an image for a children's story titled '{title}' with the following genre {story_genre} and moral {story_moral}. Draw an image that is suitable for a child aged {child_age}. The image should be colorful and engaging with a theme that matches the story and there should be no text in the image.",
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

        # image_filename = f"{new_story.user_id}_{new_story.title.lower().replace(' ', '_')}.png"
        image_filename = story_image_filename(new_story.user_id, new_story.title)
        image_path = os.path.join(IMAGE_SAVE_PATH, image_filename)
        with open(image_path, "wb") as f:
            f.write(image)

        return Response(response=json.dumps({
            "status": "success",
            "message": "Story generated successfully",
            "story": {
                "story_id": new_story.id,
                "title": new_story.title,
                "content": new_story.content,
                "image": image_filename,
                "type": "full",
            }
        }), status=201, mimetype="application/json")

    except IndexError:
        print(chat_response)
        return Response(response=json.dumps({
            "message": "Error in AI's story response.",
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
        if not story:
            return Response(response=json.dumps({
                "message": "Story not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        return Response(response=json.dumps({
            "status": "success",
            "message": "Story retrieved successfully",
            "story": {
                "title": story.title,
                "content": story.content,
                "image": story_image_filename(story.user_id, story.title),
                "timestamp": story.timestamp
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
                "image": story_image_filename(story.user_id, story.title),
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
@jwt_required()
def download_story_pdf(story_id):
    try:
        story_record = Story.query.filter_by(id=story_id).first()
        if not story_record:
            return Response(response=json.dumps({
                "message": "Story not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        # Prepare story data
        story = {
            "title": story_record.title,
            "content": story_record.content,
        }
        image_filename = story_image_filename(story_record.user_id, story_record.title)
        image_path = os.path.join(IMAGE_SAVE_PATH, image_filename)
        
        logo_path = os.path.join(os.getcwd(), "app", "src", "brand-logo.png")
        logo_base64 = get_image_as_base64(logo_path)
        logo_html = f'<img src="data:image/png;base64,{logo_base64}" alt="Brand Logo" style="width: 300px; margin: 0 auto; display: block;">' if logo_base64 else ""

        image_base64 = get_image_as_base64(image_path)
        image_html = f'<img src="data:image/jpeg;base64,{image_base64}" alt="Story Image" style="max-width: 80%; height: auto; border: 1px solid #ccc; border-radius: 8px;">' if image_base64 else "<p>Image not available</p>"

        # HTML Template for the PDF
        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    font-family: 'Georgia', serif;
                    margin: 40px;
                    line-height: 1.8;
                    color: #333;
                }}
                h1 {{
                    text-align: center;
                    color: #2c3e50;
                    font-size: 2.5em;
                    margin-bottom: 20px;
                }}
                .content {{
                    margin-top: 30px;
                    font-size: 1.1em;
                    text-align: justify;
                }}
                .image-container {{
                    text-align: center;
                    margin-top: 30px;
                }}
                .cover-page {{
                    text-align: center;
                    margin: 50px 0;
                }}
            </style>
        </head>
        <body>
            <div class="cover-page">
                {logo_html}
                <h1>{story["title"]}</h1>
                <div class="image-container">
                    {image_html}
                </div>
            </div>
            <div class="content">
                {"<p>" + "</p><p>".join(story["content"].split("\n")) + "</p>"}
            </div>
            <footer>
                <p>Generated by Story Application</p>
            </footer>
        </body>
        </html>
        """

        # Generate PDF
        pdf_io = BytesIO()
        HTML(string=html_template).write_pdf(pdf_io)
        pdf_io.seek(0)

        return send_file(
            pdf_io,
            as_attachment=True,
            download_name=f"{story_id}_story.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@story.route("/narrate/<story_id>", methods=["GET"])
@jwt_required()
def narrate_story(story_id):
    try:
        # Fetch the story from the database
        fetch_story = Story.query.filter_by(id=story_id).first()
        if not fetch_story:
            return Response(response=json.dumps({
                "message": "Story not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        story = {
            "title": fetch_story.title,
            "content": fetch_story.content.strip().split("\n")
        }

        # Configure Azure Speech SDK
        speech_config = speechsdk.SpeechConfig(
            subscription=os.getenv("AZURE_SPEECH_API_KEY"), 
            region=os.getenv("AZURE_SPEECH_API_REGION")
        )
        speech_config.speech_synthesis_voice_name = 'en-US-AvaMultilingualNeural'
        
        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)

        temp_audios = []
        durations = []

        # Generate speech for each paragraph
        for para in story["content"]:
            result = speech_synthesizer.speak_text_async(para).get()
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                audio_data = result.audio_data
                temp_audios.append(audio_data)

                # Get duration of audio
                audio = AudioSegment.from_file(io.BytesIO(audio_data), format="wav")
                durations.append(len(audio) / 1000)
            else:
                raise Exception(f"Speech synthesis failed for paragraph: {para}")

        # Combine all audio segments into one
        final_audio = AudioSegment.silent(duration=0)
        for audio in temp_audios:
            final_audio += AudioSegment.from_file(io.BytesIO(audio), format="wav")

        # Prepare the audio file for sending
        audio_io = BytesIO()
        final_audio.export(audio_io, format="wav")
        audio_io.seek(0)

        # Construct a multipart response
        m = MultipartEncoder(
            fields={
                'audio': ('audio.wav', audio_io, 'audio/wav'),
                'durations': json.dumps(durations)
            }
        )

        return Response(
            m.to_string(),
            mimetype=m.content_type,
        )

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")