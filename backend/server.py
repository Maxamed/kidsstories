import os
from flask import jsonify, Response
from flask_migrate import Migrate
from flask_jwt_extended import get_jwt, create_access_token, set_access_cookies

from app.src import create_app, db
from app.src.models.user_model import User
from app.src.models.feedback_model import Feedback
from app.src.models.story_model import Story

from datetime import datetime, timedelta

app = create_app(os.getenv('BOILERPLATE_ENV', 'dev'))
app.app_context().push()
migrate = Migrate(app, db)

@app.after_request
def refresh_expiring_jwts(response):
    try:
        claims = get_jwt()
        exp_timestamp = claims["exp"]
        now = datetime.utcnow()
        target_timestamp = datetime.timestamp(now + timedelta(hours=2))
        if target_timestamp > exp_timestamp:
            user_id = claims["sub"]
            name = claims["name"]
            email = claims["email"]
            role = claims["role"]
            
            additional_claims = {
                "name": name,
                "email": email,
                "role": role
            }
            access_token = create_access_token(identity=str(user_id), additional_claims=additional_claims)
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response

# @app.after_request
# def after_request(response):
#     if 'Access-Control-Allow-Origin' not in response.headers:
#         response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
#     if 'Access-Control-Allow-Credentials' not in response.headers:
#         response.headers.add('Access-Control-Allow-Credentials', 'true')
#     if 'Access-Control-Allow-Headers' not in response.headers:
#         response.headers.add('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-TOKEN')
#     if 'Access-Control-Allow-Methods' not in response.headers:
#         response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')

#     print(response.headers)
#     return response

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
