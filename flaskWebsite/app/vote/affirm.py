import binascii
from datetime import datetime

from hexbytes import HexBytes
from web3.auto import w3
from eth_account.messages import encode_defunct, _hash_eip191_message

from flaskWebsite.sqlConnector import sqlConnector


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
    sql = sqlConnector('../../app.db')
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

def readyForSolidity(message,hex_signature):
    #to be used with verify.sol
    # - encode the message
    hex_message = w3.toHex(text=message)
    message = encode_defunct(hexstr=hex_message)

    # - hash the message explicitly
    message_hash = _hash_eip191_message(message)

    # Remix / w3.js expect the message hash to be encoded to a hex string
    hex_message_hash = w3.toHex(message_hash)

    # ecrecover in Solidity expects the signature to be split into v as a uint8,
    #   and r, s as a bytes32
    # Remix / w3.js expect r and s to be encoded to hex
    sig = w3.toBytes(hexstr=hex_signature)
    v, hex_r, hex_s = w3.toInt(sig[-1]), w3.toHex(sig[:32]), w3.toHex(sig[32:64])

    # ecrecover in Solidity takes the arguments in order = (msghash, v, r, s)
    ec_recover_args = (hex_message_hash, v, hex_r, hex_s)
    print(ec_recover_args)

#validateVotes()
readyForSolidity('zxc','0x5ee203e977ca49f216fd490626eca3bb4f88f5fbd6d0125460f610419f31e6d03c9e2ea655bfcd400312ef4a4dca6c70f05d0ddefe60c94db0b34348213220571c')