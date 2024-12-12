import os

def create_admin_user():
    from .models.user_model import User
    from . import db
    admin_user = User.query.filter_by(role='admin').first()

    if admin_user:
        if not admin_user.email == os.getenv('ADMIN_EMAIL'):
            db.session.delete(admin_user)
            db.session.commit()
            admin_user = User(
                name="Admin",
                email=os.getenv('ADMIN_EMAIL'),
                password=os.getenv('ADMIN_PASSWORD'),
                role='admin'
            )
            db.session.add(admin_user)
            db.session.commit()
    else:
        admin_user = User(
            name="Admin",
            email=os.getenv('ADMIN_EMAIL'),
            password=os.getenv('ADMIN_PASSWORD'),
            role='admin'
        )
        db.session.add(admin_user)
        db.session.commit()