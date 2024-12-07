from .. import db
from ..models.feedback_model import Feedback
from ..models.story_model import Story

from flask import request, Response, json, Blueprint
from flask_jwt_extended import jwt_required, get_jwt

feedback = Blueprint("feedback", __name__)

@feedback.route("/submit", methods=["POST"])
@jwt_required()
def submit_feedback():
    try:
        data = request.get_json()
        rating = data.get("rating")
        comment = data.get("comment")
        story_id = data.get("story_id")

        claims = get_jwt()
        user_id = claims.get("sub")

        if not rating or not comment or not story_id:
            return Response(response=json.dumps({
                "message": "One or more required fields are missing",
                "status": "fail"
            }), status=400, mimetype="application/json")

        if rating < 0 or rating > 5:
            return Response(response=json.dumps({
                "message": "Rating must be between 0 and 5",
                "status": "fail"
            }), status=400, mimetype="application/json")

        story = Story.query.filter_by(id=story_id).first()
        if not story:
            return Response(response=json.dumps({
                "message": "Story not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        feedback = Feedback(
            rating=rating,
            comment=comment,
            story_id=story_id,
            user_id=user_id
        )

        db.session.add(feedback)
        db.session.commit()

        return Response(response=json.dumps({
            "status": "success",
            "message": "Feedback submitted successfully"
        }), status=201, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")
