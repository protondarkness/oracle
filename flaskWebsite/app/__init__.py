from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import logging
from logging.handlers import RotatingFileHandler, SMTPHandler
import os
from flask_mail import Mail

from config import Config

db = SQLAlchemy()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)

    if app.config['TESTING']:
        app.config.from_object(config_class)
        db.init_app(app)
        #print(app.config,file=sys.stderr)
        from app.errors import bp as errors_bp
        app.register_blueprint(errors_bp)

        from app.main import bp as main_bp
        app.register_blueprint(main_bp)

        from app.blog import bp as blog_bp
        app.register_blueprint(blog_bp)

        from app.packages import bp as packages_bp
        app.register_blueprint(packages_bp)

        from app.emails import bp as email_bp
        app.register_blueprint(email_bp)


        print('TESTING.....DEBUG ENVRONMENT')
        mail.init_app(app)
        from app.test_emails import bp as email_bp
        app.register_blueprint(email_bp)
        if app.config['MAIL_SERVER']:
            auth = None
            if app.config['MAIL_USERNAME'] or app.config['MAIL_PASSWORD']:
                auth = (app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
            secure = None
            if app.config['MAIL_USE_TLS']:
                secure = ()
            mail_handler = SMTPHandler(
                mailhost=(app.config['MAIL_SERVER'], app.config['MAIL_PORT']),
                fromaddr='no-reply@' + app.config['MAIL_SERVER'],
                toaddrs=app.config['ADMINS'], subject='WebBitcoin Failure',
                credentials=auth, secure=secure)
            mail_handler.setLevel(logging.ERROR)
            app.logger.addHandler(mail_handler)
            if not os.path.exists('logs'):
                os.mkdir('logs')
            file_handler = RotatingFileHandler('logs/webBitcoin.log', maxBytes=10240,
                                               backupCount=10, )
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
            file_handler.setLevel(logging.DEBUG)
            app.logger.addHandler(file_handler)

            app.logger.setLevel(logging.DEBUG)
            app.logger.info('WebBitcoin startup')
    else:
        print('not testing....ProdUTION EVIRONMENT')
        app.config.from_object(config_class)
        #db.init_app(app)
        # print(app.config,file=sys.stderr)
        from app.errors import bp as errors_bp
        app.register_blueprint(errors_bp)

        from app.main import bp as main_bp
        app.register_blueprint(main_bp)



    return app


from app import models