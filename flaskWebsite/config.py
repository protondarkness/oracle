import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'JHlkjh79333003jkjKKDJKASxnjsadalkl9439kjdoiu09s'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_APP_URL') or \
                              'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # API_DATABASE = os.environ.get('API_DATABASE_URL') or \
    #                           'sqlite:///' + os.path.join(basedir, 'Currency.db')
    # MAIL_SERVER = os.environ.get('MAIL_SERVER')
    # MAIL_PORT = int(os.environ.get('MAIL_PORT') or 25)
    # MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS') is not None
    # MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    # MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    #ADMINS = os.environ.get('ADMINS')
    DBS_DATA = os.environ.get('DB_PATH_APP_URL')
    TESTING = os.environ.get('TESTING')






