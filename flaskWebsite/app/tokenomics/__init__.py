from flask import Blueprint

bp = Blueprint('tokenomics', __name__)

from app.tokenomics import handlers
