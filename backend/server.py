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
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            user_id = claims["user_id"]
            name = claims["name"]
            role = claims["role"]
            additional_claims = {
                "user_id": user_id,
                "name": name,
                "role": role
            }
            access_token = create_access_token(identity=str(user_id), additional_claims=additional_claims)
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response

@app.errorhandler(429)
def ratelimit_exceeded(e):
    return jsonify({
        "message": "Rate limit exceeded. Please try again later.",
        "status": "fail"
    }), 429

if __name__ == '__main__':
    app.run()
