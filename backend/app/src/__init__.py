from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_cors import CORS
from .config import config_by_name

import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_remote_address():
    return request.headers.getlist("X-Forwarded-For")[0] if request.headers.get("X-Forwarded-For") else request.remote_addr

db = SQLAlchemy()
jwt = JWTManager()
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri="memcached://memcached:11211"
)

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)
    CORS(app, resources={r"/*": {"origins": ["https://kids-stories.net"]}}, supports_credentials=True)
    with app.app_context():
        db.create_all()
        from .utils import create_admin_user
        create_admin_user()

    from .routes import api, assets
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(assets, url_prefix='/assets')
    return app
