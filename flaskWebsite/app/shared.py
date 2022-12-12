
from datetime import datetime
from flask import session,request
from app.models import *






def iplog(where=''):
    ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    now = datetime.utcnow()
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    inserter = iplogger(ip=ip, time=dt_string,where=where)
    db.session.add(inserter)
    db.session.commit()