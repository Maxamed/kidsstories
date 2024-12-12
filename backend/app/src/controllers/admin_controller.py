from .. import db
from ..models.contact_model import Contact
from ..models.feedback_model import Feedback
from ..models.story_model import Story
from ..models.user_model import User

from flask import request, Response, json, Blueprint
from flask_jwt_extended import jwt_required, get_jwt

admin = Blueprint("admin", __name__)

@admin.route("/story/all", methods=["GET"])
@jwt_required()
def get_stories():
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)

        stories = Story.query.paginate(page=page, per_page=per_page, error_out=False)
        story_list = []
        for s in stories.items:
            story_list.append({
                "id": s.id,
                "title": s.title,
                "content": s.content,
                "user_id": s.user_id
            })

        return Response(response=json.dumps({
            "status": "success",
            "stories": story_list,
            "has_next": stories.has_next,
            "has_prev": stories.has_prev,
            "next_num": stories.next_num,
            "prev_num": stories.prev_num
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/story/<story_id>", methods=["GET"])
@jwt_required()
def get_story(story_id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        story = Story.query.filter_by(id=story_id).first()
        if not story:
            return Response(response=json.dumps({
                "message": "Story not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        return Response(response=json.dumps({
            "status": "success",
            "story": {
                "id": story.id,
                "title": story.title,
                "content": story.content,
                "user_id": story.user_id
            }
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/story/<story_id>", methods=["DELETE"])
@jwt_required()
def delete_story(story_id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        story = Story.query.filter_by(id=story_id).first()
        if not story:
            return Response(response=json.dumps({
                "message": "Story not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        db.session.delete(story)
        db.session.commit()

        return Response(response=json.dumps({
            "status": "success",
            "message": "Story deleted successfully"
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/user/all", methods=["GET"])
@jwt_required()
def get_users():
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)

        users = User.query.paginate(page=page, per_page=per_page, error_out=False)
        user_list = []
        for u in users.items:
            user_list.append({
                "id": u.id,
                "email": u.email,
                "name": u.name,
                "role": u.role
            })

        return Response(response=json.dumps({
            "status": "success",
            "users": user_list,
            "has_next": users.has_next,
            "has_prev": users.has_prev,
            "next_num": users.next_num,
            "prev_num": users.prev_num
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/user/<user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        user = User.query.filter_by(id=user_id).first()
        if not user:
            return Response(response=json.dumps({
                "message": "User not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        return Response(response=json.dumps({
            "status": "success",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role
            }
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/user/<user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        user = User.query.filter_by(id=user_id).first()
        if not user:
            return Response(response=json.dumps({
                "message": "User not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        db.session.delete(user)
        db.session.commit()

        return Response(response=json.dumps({
            "status": "success",
            "message": "User deleted successfully"
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/user/count", methods=["GET"])
@jwt_required()
def count_users():
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        user_count = User.query.count()

        return Response(response=json.dumps({
            "status": "success",
            "count": user_count
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/message/all", methods=["GET"])
@jwt_required()
def get_messages():
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)

        messages = Contact.query.paginate(page=page, per_page=per_page, error_out=False)
        message_list = []
        for m in messages.items:
            message_list.append({
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "message": m.message
            })

        return Response(response=json.dumps({
            "status": "success",
            "messages": message_list,
            "has_next": messages.has_next,
            "has_prev": messages.has_prev,
            "next_num": messages.next_num,
            "prev_num": messages.prev_num
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/message/<message_id>", methods=["GET"])
@jwt_required()
def get_message(message_id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        message = Contact.query.filter_by(id=message_id).first()
        if not message:
            return Response(response=json.dumps({
                "message": "Message not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        return Response(response=json.dumps({
            "status": "success",
            "message": {
                "id": message.id,
                "name": message.name,
                "email": message.email,
                "message": message.message
            }
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/message/<message_id>", methods=["DELETE"])
@jwt_required()
def delete_message(message_id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        message = Contact.query.filter_by(id=message_id).first()
        if not message:
            return Response(response=json.dumps({
                "message": "Message not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        db.session.delete(message)
        db.session.commit()

        return Response(response=json.dumps({
            "status": "success",
            "message": "Message deleted successfully"
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")