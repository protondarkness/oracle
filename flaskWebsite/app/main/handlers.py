from flask import render_template
from app.main import bp

@bp.route('/')
@bp.route('/index.html')
def index():
    user = {'username': 'Miguel'}
    title = 'hold on'
    return render_template('main/index.html',title='Intro.html',user=user)

