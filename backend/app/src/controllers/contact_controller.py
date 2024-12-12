from .. import db
from ..models.contact_model import Contact

from flask import request, Response, json, Blueprint

contact = Blueprint("contact", __name__)

@contact.route("/submit", methods=["POST"])
def submit_contact():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        message = data.get("message")

        if not name or not email or not message:
            return Response(response=json.dumps({
                "message": "One or more required fields are missing",
                "status": "fail"
            }), status=400, mimetype="application/json")

        contact = Contact(
            name=name,
            email=email,
            message=message
        )

        db.session.add(contact)
        db.session.commit()

        return Response(response=json.dumps({
            "status": "success",
            "message": "Message submitted successfully"
        }), status=201, mimetype="application/json")

    except Exception as e:
        return Response(response=json.dumps({
            "message": f"An error occurred: {str(e)}",
            "status": "fail"
        }), status=500, mimetype="application/json")