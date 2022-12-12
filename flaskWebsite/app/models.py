from app import db


class Votes(db.Model):
    __tablename__ = 'voting'
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.Integer)
    smsg = db.Column(db.String)
    account = db.Column(db.String)
    vote = db.Column(db.String)
    balance = db.Column(db.Integer)
    valid= db.Column(db.Boolean,nullable=False,default=0)



    def getTime(self):
        return self.time

    def getAddress(self):
        return self.account

    def getVote(self):
        return self.vote

class iplogger(db.Model):
    __tablename__ = 'iplogger'
    numQ = db.Column(db.Integer(), primary_key=True,autoincrement=True)
    ip= db.Column(db.String())
    time = db.Column(db.Integer())
    where = db.Column(db.String())