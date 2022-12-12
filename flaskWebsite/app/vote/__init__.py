from flask import Blueprint

bp = Blueprint('vote', __name__)

from app.vote import handlers
