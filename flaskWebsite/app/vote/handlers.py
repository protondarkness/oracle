from datetime import datetime

from flask import render_template, request, flash, redirect
from app import db
from app.models import Votes
from app.vote import bp
from app.vote.voteForm import VoteForm


@bp.route('/vote.html',methods=['GET','POST'])
def vote():
    form = VoteForm()
    if form.validate_on_submit():
        print(form.Account)
        try:
            now = datetime.now()
            timestamp = int(datetime.timestamp(now))
            ballot = Votes(time=timestamp,smsg=form.SignedMessage.data, account=form.Account.data, vote=form.Vote.data, balance=0, valid=False)
            db.session.add(ballot)
            db.session.commit()
        except AttributeError as ee:
            print(ee)
    else:
        print(form)

    return render_template('vote/vote.html', title='Sign In', form=form)
