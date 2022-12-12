from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired
from app.models import Votes

class VoteForm(FlaskForm):
    Account = StringField('Account', validators=[DataRequired()],id='signAccount')
    SignedMessage = StringField('SignedMessage', validators=[DataRequired()], id='signTypedDataResult')
    Vote = StringField('Vote', validators=[DataRequired()],id='Vote')
    submit = SubmitField('Submit')

