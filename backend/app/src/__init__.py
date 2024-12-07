from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
from .config import config_by_name


db = SQLAlchemy()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address)

def create_app(config_name):
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins=["*"])
    app.config.from_object(config_by_name[config_name])
    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)
    # CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    from .routes import api, assets
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(assets, url_prefix='/assets')
    
    # Health Check Route
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "message": "Server is running"}), 200
    
    return app


