from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .config import config_by_name

db = SQLAlchemy()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address)

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)
    from .routes import api, assets
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(assets, url_prefix='/assets')
    return app
