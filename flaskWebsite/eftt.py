from app import create_app
from debug import Config as Debug
from config import Config as Confi

app = create_app(Debug)