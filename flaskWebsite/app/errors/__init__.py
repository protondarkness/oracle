from flask import Blueprint

bp = Blueprint('errors', __name__)

from app.main import handlers
