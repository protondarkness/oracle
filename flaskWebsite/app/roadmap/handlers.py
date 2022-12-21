from datetime import datetime

from flask import render_template, request
from app import db
from app.roadmap import bp


@bp.route('/roadmap.html')
def index():
    return render_template('roadmap/roadmap.html')



def iplog(where=''):
    ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    now = datetime.utcnow()
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    # inserter = iplogger(ip=ip, time=dt_string,where=where)
    # db.session.add(inserter)
    # db.session.commit()