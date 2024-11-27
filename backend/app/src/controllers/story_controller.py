import os
import traceback

from flask import request, Response, json, Blueprint
from ..models.user_model import User
from ..models.story_model import Story
from .. import db
from .. import limiter

from flask_jwt_extended import jwt_required, get_jwt

from openai import AzureOpenAI
import requests

story = Blueprint("story", __name__)
IMAGE_SAVE_PATH = os.path.join(os.getcwd(), "assets", "images")

@story.route("/generate-preview", methods=["POST"])
@limiter.limit("1 per day", error_message="Only one story preview can be generated per day by unregistered users")
def generate_preview():
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
                "type": "preview",
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
        print(len(chat_response.split("\n")))
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

        image_filename = f"{new_story.usesr_id}_{new_story.title.lower().replace(' ', '_')}.png"
        image_path = os.path.join(IMAGE_SAVE_PATH, image_filename)
        with open(image_path, "wb") as f:
            f.write(image)

        return Response(response=json.dumps({
            "status": "success",
            "message": "Story generated successfully",
            "story": {
                "title": new_story.title,
                "content": new_story.content,
                "image": image_filename,
                "type": "full",
            }
        }), status=201, mimetype="application/json")

    except Exception as e:
        error_traceback = traceback.format_exc()
        print(error_traceback)

        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

# @story.route("/generate", methods=["POST"])
# def generate():
#     mode = 0
#     try:
#         token = request.headers.get("Authorization")
#         if token:
#             payload = jwt.decode(token, key, algorithms=["HS256"])
#             user_id = payload.get("user_id")
#             fetch_user = User.query.filter_by(id=user_id).first()
#             if not fetch_user or fetch_user.email != payload.get("user_email"):
#                 return Response(response=json.dumps({
#                     "message": "Invalid token",
#                     "status": "fail"
#                 }), status=401, mimetype="application/json")
#             mode = 1

#         data = request.get_json()
#         child_age = data.get("child_age")
#         child_name = data.get("child_name")
#         story_moral = data.get("story_moral")
#         story_description = data.get("story_description")

#         if not child_age or not child_name or not story_moral or not story_description:
#             return Response(response=json.dumps({
#                 "message": "Child age, child name, story moral or story description is missing",
#                 "status": "fail"
#             }), status=400, mimetype="application/json")

#         chat_client = AzureOpenAI(
#             azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
#             api_key = os.getenv("AZURE_OPENAI_API_KEY"), 
#             api_version = os.getenv("AZURE_OPENAI_CHAT_API_VERSION")
#         )
        
#         image_client = AzureOpenAI(
#             azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
#             api_key = os.getenv("AZURE_OPENAI_API_KEY"), 
#             api_version = os.getenv("AZURE_OPENAI_IMAGE_API_VERSION")
#         )

#         chat_response = chat_client.chat.completions.create(
#             model = os.getenv("AZURE_OPENAI_CHAT_MODEL_NAME"),
#             messages = [
#                 {
#                     "role": "system",
#                     "content": "You are a short story writer for children. You will be given the following information formatted like this: \nChild age: <Age>\nChild name: <Name>, Story moral: <Moral>, Story description: <Description>. Please write a short story for children based on this information and incorporate the child name, moral and description in the story. The story should be suitable for the age of the child provided. Return the story in the following format: \nTitle: <Title>\nStory: <Story>"
#                 },
#                 {
#                     "role": "user",
#                     "content": f"Child age: {child_age}\nChild name: {child_name}, Story moral: {story_moral}, Story description: {story_description}"
#                 }
#             ]
#         )

#         chat_response = chat_response.choices[0].message.content
#         story = chat_response.split("Story: ")[1].strip().split("\n")
#         story = [line.strip() for line in story if line.strip() != ""]
#         title = chat_response.split("Title: ")[1].split("\n")[0].strip()

#         if mode == 1:
#             image_response = image_client.images.generate(
#                 model = os.getenv("AZURE_OPENAI_IMAGE_MODEL_NAME"),
#                 prompt = f"Generate an image for a children's story titled '{title}' with the following description: {story_description}",
#             )
#             image_url = image_response.data[0].url
#             image = requests.get(image_url).content

#             new_story = Story(
#                 user_id = user_id,
#                 title = title,
#                 content = "\n".join(story),
#                 customization = {
#                     "child_age": child_age,
#                     "child_name": child_name,
#                     "story_moral": story_moral,
#                     "story_description": story_description
#                 },
#                 timestamp = datetime.utcnow()
#             )

#             db.session.add(new_story)
#             db.session.commit()

#             image_filename = f"story_{new_story.id}_{title.lower().replace(' ', '_')}.png"
#             image_path = os.path.join(IMAGE_SAVE_PATH, image_filename)
#             with open(image_path, "wb") as f:
#                 f.write(image)

#             return Response(response=json.dumps({
#                 "status": "success",
#                 "message": "Story generated successfully",
#                 "story": {
#                     "title": new_story.title,
#                     "content": new_story.content,
#                     "image": new_story.image_filename,
#                     "type": "full",
#                 }
#             }), status=201, mimetype="application/json")
#         else:
#             return Response(response=json.dumps({
#                 "status": "success",
#                 "message": "Story generated successfully",
#                 "story": {
#                     "title": title,
#                     "content": "\n".join(story[:2]),
#                     "type": "partial",
#                 }
#             }), status=200, mimetype="application/json")


#     except Exception as e:
#         return Response(response=json.dumps({
#             "message": f"An error occurred: {str(e)}",
#             "status": "fail"
#         }), status=500, mimetype="application/json")
