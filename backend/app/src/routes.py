from flask import Blueprint
from .controllers.user_controller import user as UserController
from .controllers.story_controller import story as StoryController
from .controllers.feedback_controller import feedback as FeedbackController
from .controllers.image_controller import image as ImageController

api = Blueprint('api', __name__)
api.register_blueprint(UserController, url_prefix='/user')
api.register_blueprint(StoryController, url_prefix='/story')
api.register_blueprint(FeedbackController, url_prefix='/feedback')

assets = Blueprint('assets', __name__)
assets.register_blueprint(ImageController, url_prefix='/images')