from flask import Blueprint
from .controllers.user_controller import user as UserController
from .controllers.story_controller import story as StoryController
from .controllers.feedback_controller import feedback as FeedbackController
from .controllers.admin_controller import admin as AdminController
from .controllers.contact_controller import contact as ContactController

from .controllers.image_controller import image as ImageController
from .controllers.audio_controller import audio as AudioController

api = Blueprint('api', __name__)
api.register_blueprint(UserController, url_prefix='/user')
api.register_blueprint(StoryController, url_prefix='/story')
api.register_blueprint(FeedbackController, url_prefix='/feedback')
api.register_blueprint(AdminController, url_prefix='/admin')
api.register_blueprint(ContactController, url_prefix='/contact')

assets = Blueprint('assets', __name__)
assets.register_blueprint(ImageController, url_prefix='/images')
assets.register_blueprint(AudioController, url_prefix='/audios')