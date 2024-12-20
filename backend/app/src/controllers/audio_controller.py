import os

from flask import Flask, request, Response, Blueprint, send_file, json
from flask_jwt_extended import jwt_required, get_jwt_identity

app = Flask(__name__)

AUDIO_FOLDER = os.path.join(os.getcwd(), "assets", "audios")
os.makedirs(AUDIO_FOLDER, exist_ok=True)

audio = Blueprint("audio", __name__)

@audio.route("/<audio_name>", methods=["GET"])
def get_audio(audio_name):
    try:
        audio_path = os.path.join(AUDIO_FOLDER, audio_name)
        if not os.path.exists(audio_path):
            return Response(response=json.dumps({
                "message": "Audio not found",
                "status": "fail"
            }), status=404, mimetype="application/json")
        return send_file(audio_path, mimetype="audio/wav")
    except Exception as e:
        return Response(response=json.dumps({
            "message": str(e),
            "status": "fail"
        }), status=500, mimetype="application/json")