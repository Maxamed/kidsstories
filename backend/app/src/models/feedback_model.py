from sqlalchemy.dialects.postgresql import UUID
from .. import db
from datetime import datetime
from uuid import uuid4

class Feedback(db.Model):
    __tablename__ = "Feedback"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("User.id"), nullable=False)
    story_id = db.Column(UUID(as_uuid=True), db.ForeignKey("Story.id"), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
