import hexbytes as hexbytes
import web3
from hexbytes import HexBytes
from web3.auto import w3
from eth_account.messages import encode_defunct
# msg = "I♥SF"
private_key = b"\xb2\\}\xb3\x1f\xee\xd9\x12''\xbf\t9\xdcv\x9a\x96VK-\xe4\xc4rm\x03[6\xec\xf1\xe5\xb3d"
# message = encode_defunct(text=msg)
# signed_message = w3.eth.account.sign_message(message, private_key=private_key)
#
# test_str = 'Hello World!'


# blockchain of text example
arrToEncode = ['hi','im','fucking','around']

for i in arrToEncode:
    message = encode_defunct(text=i)
    signed_message = w3.eth.account.sign_message(message,private_key=private_key)
    print(signed_message)
    print(w3.eth.account.recover_message(message, signature=signed_message.signature))