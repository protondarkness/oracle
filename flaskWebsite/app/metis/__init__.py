from flask import Blueprint

bp = Blueprint('metis', __name__)

from app.metis import handlers
