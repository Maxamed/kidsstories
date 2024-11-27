from sqlalchemy.dialects.postgresql import UUID
from .. import db
from datetime import datetime
from uuid import uuid4

class Story(db.Model):
    __tablename__ = "Story"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("User.id"), nullable=False)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    customization = db.Column(db.JSON)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    feedback = db.relationship("Feedback", backref="Story", lazy=True)