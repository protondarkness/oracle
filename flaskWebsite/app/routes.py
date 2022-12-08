from flask import render_template
from app import app

@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'Miguel'}
    title = 'hold on'
    return render_template('index.html', title=title, user=user)

