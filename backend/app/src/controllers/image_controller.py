import os

from flask import Flask, request, Response, Blueprint, send_file, json
from flask_jwt_extended import jwt_required, get_jwt_identity

app = Flask(__name__)

IMAGE_FOLDER = os.path.join(os.getcwd(), "assets", "images")
os.makedirs(IMAGE_FOLDER, exist_ok=True)

image = Blueprint("image", __name__)

@image.route("/<image_name>", methods=["GET"])
@jwt_required()
def get_image(image_name):
    try:
        image_path = os.path.join(IMAGE_FOLDER, image_name)
        user_id_from_token = get_jwt_identity()
        user_id_from_image = image_name.split("_")[0]
        if user_id_from_token != user_id_from_image or not user_id_from_token or not os.path.exists(image_path):
            return Response(response=json.dumps({
                "message": "Image not found or unauthorized",
                "status": "fail"
            }), status=404, mimetype="application/json")
        return send_file(image_path, mimetype="image/jpeg")
    except Exception as e:
        return Response(response=json.dumps({
            "message": str(e),
            "status": "fail"
        }), status=500, mimetype="application/json")