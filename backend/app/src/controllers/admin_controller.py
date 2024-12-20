from .. import db
from ..models.contact_model import Contact
from ..models.feedback_model import Feedback
from ..models.story_model import Story
from ..models.user_model import User

from flask import request, Response, json, Blueprint
from flask_jwt_extended import jwt_required, get_jwt

from uuid import UUID
def is_valid_uuid(val):
    try:
        return str(UUID(val)) == val
    except ValueError:
        return False

admin = Blueprint("admin", __name__)

@admin.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard():
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        user_count = User.query.count()
        story_count = Story.query.count()
        feedback_count = Feedback.query.count()
        contact_count = Contact.query.count()

        return Response(response=json.dumps({
            "status": "success",
            "user_count": user_count,
            "story_count": story_count,
            "feedback_count": feedback_count,
            "contact_count": contact_count
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
                "role": user.role,
                "account_type": user.account_type,
                "timestamp": user.timestamp,
                "story_count": len(user.story),
                "feedback_count": len(user.feedback)
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
        by_user = request.args.get("by_user", None, type=str)
        if by_user:
            by_user = by_user.strip()
        if by_user and not is_valid_uuid(by_user):
            return Response(response=json.dumps({
                "status": "success",
                "stories": [],
                "has_next": False,
                "has_prev": False,
                "next_num": None,
                "prev_num": None
            }), status=200, mimetype="application/json")

        if by_user:
            stories = Story.query.filter_by(user_id=by_user).paginate(page=page, per_page=per_page, error_out=False)
        else:
            stories = Story.query.paginate(page=page, per_page=per_page, error_out=False)


        story_list = []
        for s in stories.items:
            story_list.append({
                "id": s.id,
                "title": s.title,
                "content": s.content[:100] + "...",
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
                "user_id": story.user_id,
                "isPublished": story.isPublished,
                "timestamp": story.timestamp,
                "feedback_count": len(story.feedback)
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

@admin.route("/feedback/all", methods=["GET"])
@jwt_required()
def get_feedbacks():
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
        by_user = request.args.get("by_user", None, type=str)
        by_story = request.args.get("by_story", None, type=str)
        if by_user:
            by_user = by_user.strip()
        if by_story:
            by_story = by_story.strip()
        if (by_user and not is_valid_uuid(by_user)) or (by_story and not is_valid_uuid(by_story)):
            return Response(response=json.dumps({
                "status": "success",
                "feedbacks": [],
                "has_next": False,
                "has_prev": False,
                "next_num": None,
                "prev_num": None
            }), status=200, mimetype="application/json")

        if by_user and by_story:
            feedbacks = Feedback.query.filter_by(user_id=by_user, story_id=by_story).paginate(page=page, per_page=per_page, error_out=False)
        elif by_user:
            feedbacks = Feedback.query.filter_by(user_id=by_user).paginate(page=page, per_page=per_page, error_out=False)
        elif by_story:
            feedbacks = Feedback.query.filter_by(story_id=by_story).paginate(page=page, per_page=per_page, error_out=False)
        else:
            feedbacks = Feedback.query.paginate(page=page, per_page=per_page, error_out=False)

        feedback_list = []
        for f in feedbacks.items:
            feedback_list.append({
                "id": f.id,
                "user_id": f.user_id,
                "story_id": f.story_id,
                "rating": f.rating,
                "comment": f.comment,
                "timestamp": f.timestamp
            })

        return Response(response=json.dumps({
            "status": "success",
            "feedbacks": feedback_list,
            "has_next": feedbacks.has_next,
            "has_prev": feedbacks.has_prev,
            "next_num": feedbacks.next_num,
            "prev_num": feedbacks.prev_num
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/feedback/<feedback_id>", methods=["GET"])
@jwt_required()
def get_feedback(feedback_id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        feedback = Feedback.query.filter_by(id=feedback_id).first()
        if not feedback:
            return Response(response=json.dumps({
                "message": "Feedback not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        return Response(response=json.dumps({
            "status": "success",
            "feedback": {
                "id": feedback.id,
                "user_id": feedback.user_id,
                "story_id": feedback.story_id,
                "rating": feedback.rating,
                "comment": feedback.comment,
                "timestamp": feedback.timestamp
            }
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/feedback/<feedback_id>", methods=["DELETE"])
@jwt_required()
def delete_feedback(feedback_id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        feedback = Feedback.query.filter_by(id=feedback_id).first()
        if not feedback:
            return Response(response=json.dumps({
                "message": "Feedback not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        db.session.delete(feedback)
        db.session.commit()

        return Response(response=json.dumps({
            "status": "success",
            "message": "Feedback deleted successfully"
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/contact/all", methods=["GET"])
@jwt_required()
def get_contacts():
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

        contacts = Contact.query.paginate(page=page, per_page=per_page, error_out=False)
        contact_list = []
        for c in contacts.items:
            contact_list.append({
                "id": c.id,
                "name": c.name,
                "email": c.email,
            })

        return Response(response=json.dumps({
            "status": "success",
            "contacts": contact_list,
            "has_next": contacts.has_next,
            "has_prev": contacts.has_prev,
            "next_num": contacts.next_num,
            "prev_num": contacts.prev_num
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/contact/<contact_id>", methods=["GET"])
@jwt_required()
def get_contact(contact_id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        contact = Contact.query.filter_by(id=contact_id).first()
        if not contact:
            return Response(response=json.dumps({
                "message": "Contact not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        return Response(response=json.dumps({
            "status": "success",
            "contact": {
                "id": contact.id,
                "name": contact.name,
                "email": contact.email,
                "message": contact.message,
                "timestamp": contact.timestamp
            }
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")

@admin.route("/contact/<contact_id>", methods=["DELETE"])
@jwt_required()
def delete_contact(contact_id):
    try:
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return Response(response=json.dumps({
                "message": "You do not have permission to access this resource",
                "status": "fail"
            }), status=403, mimetype="application/json")

        contact = Contact.query.filter_by(id=contact_id).first()
        if not contact:
            return Response(response=json.dumps({
                "message": "Contact not found",
                "status": "fail"
            }), status=404, mimetype="application/json")

        db.session.delete(contact)
        db.session.commit()

        return Response(response=json.dumps({
            "status": "success",
            "message": "Contact deleted successfully"
        }), status=200, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")