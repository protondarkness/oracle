from datetime import datetime

from flask import render_template, request, flash, redirect
from app import db
from app.register import bp



@bp.route('/register.html',methods=['GET','POST'])
def vote():
   return render_template('register/register.html')
