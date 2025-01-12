from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from bcrypt import checkpw, hashpw, gensalt
from uuid import uuid4
from .. import db

class User(db.Model):
    __tablename__ = "User"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = db.Column(db.Text, nullable=False, unique=True)
    password_hash = db.Column(db.Text)
    google_id = db.Column(db.Text)
    account_type = db.Column(db.Text, default="local", nullable=False)
    name = db.Column(db.Text, nullable=False)
    role = db.Column(db.Text, default="user", nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    story = db.relationship("Story", backref="User", lazy=True, cascade="all, delete")
    feedback = db.relationship("Feedback", backref="User", lazy=True, cascade="all, delete")

    def __init__(self, email, name, password=None, google_id=None, role="user"):
        self.email = email
        self.name = name
        self.role = role
        if password:
            self._set_password(password)
        if google_id:
            self.google_id = google_id
            self.account_type = "google"

    def check_password(self, password):
        return checkpw(password.encode("utf-8"), self.password_hash.encode("utf-8"))

    def _set_password(self, password):
        hashedpw = hashpw(password.encode("utf-8"), gensalt())
        self.password_hash = hashedpw.decode("utf-8")