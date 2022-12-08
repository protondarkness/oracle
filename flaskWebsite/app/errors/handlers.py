from datetime import datetime

from flask import render_template, request
from app import db
from app.errors import bp
from app.models import iplogger


@bp.app_errorhandler(404)
def not_found_error(error):
    iplog('error 404')
    return render_template('errors/404.html'), 404


@bp.app_errorhandler(500)
def internal_error(error):
   # db.session.rollback()
    iplog('error 500')
    return render_template('errors/500.html'), 500


@bp.app_errorhandler(503)
def internal_error(error):
    iplog('error 503 db error')
    return render_template('errors/500.html'), 503


@bp.app_errorhandler(405)
def not_found_error(error):
    iplog('error 405')
    return render_template('errors/405.html'), 405


@bp.app_errorhandler(400)
def not_found_error(error):
    iplog('error 400')
    return render_template('errors/404.html'), 400


@bp.app_errorhandler(401)
def not_found_error(error):
    iplog('error 401')
    return render_template('errors/401.html'), 401


def iplog(where=''):
    ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    now = datetime.utcnow()
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    # inserter = iplogger(ip=ip, time=dt_string,where=where)
    # db.session.add(inserter)
    # db.session.commit()