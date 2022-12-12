import binascii
import os
import re
from datetime import datetime

import hexbytes as hexbytes
from hexbytes import HexBytes
from web3.auto import w3
from eth_account.messages import encode_defunct

import config
from sqlConnector import sqlConnector
from config import Config


# msg = "I♥SF"
# private_key = b"\xb2\\}\xb3\x1f\xee\xd9\x12''\xbf\t9\xdcv\x9a\x96VK-\xe4\xc4rm\x03[6\xec\xf1\xe5\xb3d"
# message = encode_defunct(text=msg)
# signed_message = w3.eth.account.sign_message(message, private_key=private_key)


# t1 ='nuginz'
# signed = '0xf34d5ead037993a21e306a09131cc3b3abb892e07c4f1418ecfedadf3c2ee996447da8c92ea4fdfea63a5c920e7f1d67c728466c1956127d597256a744c709d81c'
# message = encode_defunct(text=t1)
# sig = HexBytes(signed)
# print(sig)
# print(message)
# print(w3.eth.account.recover_message(message, signature=sig))
def getTime():
    now = datetime.now()
    timestamp = int(datetime.timestamp(now))
    return timestamp

def validateVotes():
    sql = sqlConnector('/home/destro/Desktop/oracle/flaskWebsite/app.db')
    res = sql.sqlfetchDict("SELECT * FROM voting where valid == 0")
    res = sql.sqlfetchDict("SELECT * FROM voting")
    for r in res:
        try:
            sig = HexBytes(r['smsg'])
            msg = encode_defunct(text=r['vote'])
            recovered =w3.eth.account.recover_message(msg, signature=sig)
            print(recovered+" "+r['account'])
            if str(recovered).lower() == str(r['account']).lower():
                sql.sqlexe("UPDATE voting Set valid= {v1} where id = {v2}".format(v1=1,v2=r['id']))
                s1 = 'SELECT smsg,sum(balance) ball, COUNT(smsg) c FROM voting GROUP BY smsg'
                resultant = sql.sqlfetchDict(s1)
                print(resultant)
        except binascii.Error as e:
            print(e)

validateVotes()