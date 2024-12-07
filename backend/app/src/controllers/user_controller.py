import os
import requests

from .. import db
from ..models.user_model import User

from flask import request, Response, json, Blueprint
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies, jwt_required, get_jwt

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

user = Blueprint("user", __name__)

@user.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")

        if not email or not password or not name:
            return Response(response=json.dumps({
                "message": "Email, password or name is missing",
                "status": "fail"
            }), status=400, mimetype="application/json")

        fetch_user = User.query.filter_by(email=email).first()
        if fetch_user:
            return Response(response=json.dumps({
                "message": f"User with email {email} already exists",
                "status": "fail"
            }), status=400, mimetype="application/json")

        new_user = User(email=email, name=name, password=password)
        db.session.add(new_user)
        db.session.commit()

        return Response(response=json.dumps({
            "message": "User registered successfully",
            "status": "success"
        }), status=201, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@user.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return Response(response=json.dumps({
                "message": "Email or password is missing",
                "status": "fail"
            }), status=400, mimetype="application/json")

        fetch_user = User.query.filter_by(email=email).first()
        if not fetch_user:
            return Response(response=json.dumps({
                "message": "User not found or invalid credentials",
                "status": "fail"
            }), status=400, mimetype="application/json")
        else:
            if fetch_user.account_type == "google":
                return Response(response=json.dumps({
                    "message": "This user account was created using a different login method. Please use the correct login method to access your account.",
                    "status": "fail"
                }), status=400, mimetype="application/json")
            if not fetch_user.check_password(password):
                return Response(response=json.dumps({
                    "message": "User not found or invalid credentials",
                    "status": "fail"
                }), status=400, mimetype="application/json")

        claims = {
            "name": fetch_user.name,
            "email": fetch_user.email,
            "role": fetch_user.role
        }
        access_token = create_access_token(identity=str(fetch_user.id), additional_claims=claims)

        response = Response(response=json.dumps({
            "user_data": {
                "id": fetch_user.id,
                "name": fetch_user.name,
                "email": fetch_user.email,
                "role": fetch_user.role
            },
            "message": "User logged in successfully",
            "status": "success"
        }), status=200, mimetype="application/json")

        set_access_cookies(response, access_token)
        return response

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@user.route("/logout", methods=["POST"])
def logout():
    try:
        response = Response(response=json.dumps({
            "message": "User logged out successfully",
            "status": "success"
        }), status=200, mimetype="application/json")

        unset_jwt_cookies(response)
        return response

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@user.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    try:
        current_user = get_jwt()
        user_id = current_user["sub"]

        fetch_user = User.query.filter_by(id=user_id).first()
        if not fetch_user:
            return Response(response=json.dumps({
                "message": "User not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        return Response(response=json.dumps({
            "user_data": {
                "id": fetch_user.id,
                "name": fetch_user.name,
                "email": fetch_user.email,
                "role": fetch_user.role
            },
            "message": "User profile retrieved successfully",
            "status": "success"
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@user.route("/google-login", methods=["POST"])
def google_login():
    try:
        data = request.get_json()
        access_token = data.get("google_token")
        if not access_token:
            return Response(response=json.dumps({
                "message": "Google token is missing",
                "status": "fail"
            }), status=400, mimetype="application/json")

        response = requests.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            params={"access_token": access_token}
        )

        if response.status_code != 200:
            return Response(response=json.dumps({
                "message": "Invalid Google token",
                "status": "fail"
            }), status=400, mimetype="application/json")

        google_data = response.json()
        google_id = google_data.get("id")
        email = google_data.get("email")
        name = google_data.get("name")

        fetch_user = User.query.filter_by(email=email).first()
        if fetch_user and fetch_user.account_type != "google":
            return Response(response=json.dumps({
                "message": "This user account was created using a different login method. Please use the correct login method to access your account.",
                "status": "fail"
            }), status=400, mimetype="application/json")

        if not fetch_user:
            return Response(response=json.dumps({
                "message": "User not found or invalid credentials",
                "status": "fail"
            }), status=400, mimetype="application/json")

        claims = {
            "name": fetch_user.name,
            "email": fetch_user.email,
            "role": fetch_user.role
        }
        access_token = create_access_token(identity=str(fetch_user.id), additional_claims=claims)

        response = Response(response=json.dumps({
            "user_data": {
                "id": fetch_user.id,
                "name": fetch_user.name,
                "email": fetch_user.email,
                "role": fetch_user.role
            },
            "message": "User logged in successfully",
            "status": "success"
        }), status=200, mimetype="application/json")

        set_access_cookies(response, access_token)
        return response

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@user.route("/google-register", methods=["POST"])
def google_register():
    try:
        data = request.get_json()
        access_token = data.get("google_token")
        if not access_token:
            return Response(response=json.dumps({
                "message": "Google token is missing",
                "status": "fail"
            }), status=400, mimetype="application/json")

        response = requests.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            params={"access_token": access_token}
        )

        if response.status_code != 200:
            return Response(response=json.dumps({
                "message": "Invalid Google token",
                "status": "fail"
            }), status=400, mimetype="application/json")

        google_data = response.json()
        google_id = google_data.get("id")
        email = google_data.get("email")
        name = google_data.get("name")

        fetch_user = User.query.filter_by(email=email).first()
        if fetch_user and fetch_user.account_type != "google":
            return Response(response=json.dumps({
                "message": "User with email {email} already exists with a different login method",
                "status": "fail"
            }), status=400, mimetype="application/json")
        elif fetch_user and fetch_user.account_type == "google":
            return Response(response=json.dumps({
                "message": "User with email {email} already exists",
                "status": "fail"
            }), status=400, mimetype="application/json")

        new_user = User(email=email, name=name, google_id=google_id)
        db.session.add(new_user)
        db.session.commit()
        
        return Response(response=json.dumps({
            "message": "User registered successfully",
            "status": "success"
        }), status=201, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")