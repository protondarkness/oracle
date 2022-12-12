from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_migrate import Migrate

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)

    if app.config['TESTING']:
        app.config.from_object(config_class)
        db.init_app(app)
        #print(app.config,file=sys.stderr)
        from app.errors import bp as errors_bp
        app.register_blueprint(errors_bp)
    else:
        print('not testing....ProdUTION EVIRONMENT')
        app.config.from_object(config_class)

        db.init_app(app)
        migrate = Migrate(app, db)
        #db.init_app(app)
        # print(app.config,file=sys.stderr)
        from app.errors import bp as errors_bp
        app.register_blueprint(errors_bp)

        from app.main import bp as main_bp
        app.register_blueprint(main_bp)

        from app.vote import bp as vote_bp
        app.register_blueprint(vote_bp)


    return app


from app import models