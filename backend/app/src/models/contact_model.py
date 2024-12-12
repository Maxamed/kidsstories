from sqlalchemy.dialects.postgresql import UUID
from .. import db
from datetime import datetime
from uuid import uuid4

class Contact(db.Model):
    __tablename__ = "Contact"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)