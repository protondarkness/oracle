from sqlalchemy import ForeignKey
from time import time
import jwt
from app import db
from flask import current_app

class Authenticate(db.Model):
    __tablename__ = 'authenticate'
    idx = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.String())
    api = db.Column(db.String(50),nullable=False)
    package = db.Column(db.String(1000))
    downloads = db.Column(db.Integer(), default=0)

    def getPackage(self):
        return self.package


class Order(db.Model):
    __tablename__ = 'orders'
    api = db.Column(db.String(50), primary_key=True)
    time = db.Column(db.String(50))
    package = db.Column(db.String(64), index=True)
    price = db.Column(db.Float)
    chain = db.Column(db.String)
    address = db.Column(db.String(128), index=True, unique=True)
    confirmedPayment = db.Column(db.Integer,nullable=False,default=0)
    PaymentAmount = db.Column(db.Float, default=0)
    email = db.Column(db.String(100))
    contact = db.Column(db.Boolean())

    def getTime(self):
        return self.time

    def getAddress(self):
        return self.address

    def getPrice(self):
        return self.price


class bchadr(db.Model):
    __tablename__ = 'bchadr'
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(50))
    used = db.Column(db.Integer())

    def getId(self):
        return self.id

    def getAddress(self):
        return self.address

    def getUsed(self):
        return self.used


class btcadr(db.Model):
    __tablename__ = 'btcadr'
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(50))
    used = db.Column(db.Integer())

    def getId(self):
        return self.id

    def getAddress(self):
        return self.address

    def getUsed(self):
        return self.used


class times(db.Model):
    __tablename__ = 'times'
    exc = db.Column(db.String(50),primary_key=True)
    id = db.Column(db.String())
    total = db.Column(db.Integer())
    actualtotal = db.Column(db.Integer())
    st = db.Column(db.Integer())
    end = db.Column(db.Integer())
    totalYrs = db.Column(db.Float())
    excs =  db.Column(db.String())
    def getTotal(self):
        return self.total

    def getActualTotal(self):
        return self.actualtotal

    def getSt(self):
        return self.st

    def getEnd(self):
        return self.end

    def getTotalYrs(self):
        return self.totalYrs

    def getExc(self):
        return self.exc


class currentPrices(db.Model):
    __tablename__ = 'currentPrices'
    chain = db.Column(db.String(), primary_key=True)
    time = db.Column(db.Integer())
    avg = db.Column(db.Integer())


class packages(db.Model):
    __tablename__ = 'packages'
    id = db.Column(db.String(), primary_key=True)
    price = db.Column(db.Integer())
    tabledesc = db.Column(db.String())
    name = db.Column(db.String())
    active = db.Column(db.String())
    tablename = db.Column(db.String())
    dbLocation = db.Column(db.String())
    startdate = db.Column(db.Integer())
    enddate = db.Column(db.Integer())
    bucket = db.Column(db.String())
    currency = db.Column(db.Float())
    gid = db.Column(db.String())
    pic = db.Column(db.String())
    desc = db.Column(db.String())


class groupings(db.Model):
    __tablename__ = 'groupings'
    names = db.Column(db.String())
    readableNames = db.Column(db.String())
    cginfo = db.Column(db.String())
    url = db.Column(db.String())
    desc = db.Column(db.String())
    gid = db.Column(db.String(), primary_key=True)
    display = db.Column(db.Integer())

class iplogger(db.Model):
    __tablename__ = 'iplogger'
    numQ = db.Column(db.Integer(), primary_key=True,autoincrement=True)
    ip= db.Column(db.String())
    time = db.Column(db.Integer())
    where = db.Column(db.String())


class menu(db.Model):
    __tablename__ = 'menu'
    id = db.Column(db.Integer(), primary_key=True)
    header = db.Column(db.String())
