from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect

db = SQLAlchemy()
csrf = CSRFProtect()
def create_app(config_class=Config):
    app = Flask(__name__)
    csrf.init_app(app)
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

        from app.metis import bp as metis_bp
        app.register_blueprint(metis_bp)

        from app.tokenomics import bp as tokenomics_bp
        app.register_blueprint(tokenomics_bp)

        from app.roadmap import bp as roadmap_bp
        app.register_blueprint(roadmap_bp)

        from app.register import bp as register_bp
        app.register_blueprint(register_bp)
    return app


from app import models