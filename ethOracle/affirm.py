import hexbytes as hexbytes
from hexbytes import HexBytes
from web3.auto import w3
from eth_account.messages import encode_defunct
msg = "I♥SF"
private_key = b"\xb2\\}\xb3\x1f\xee\xd9\x12''\xbf\t9\xdcv\x9a\x96VK-\xe4\xc4rm\x03[6\xec\xf1\xe5\xb3d"
message = encode_defunct(text=msg)
signed_message = w3.eth.account.sign_message(message, private_key=private_key)

test_str = 'Hello World!'
t1 ='Example `personal_sign` message'
signed = '0xbc2e00802f2a90df98fc339f95643ab687030a0096e0d4d3ee0eda8b5b88113913e9c1002c52bdd71b5046ae0ae404dc02d96965341c1edd3f7be0c03ddec6731b'
res ='0x1844405bfc21751b37e0d0dbea71027669ce0f41'
#message ='0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0'
message = encode_defunct(text=t1)
sig = HexBytes('0x23e5a5cf23e2585b9b145cb5b1b7206f413725dddca51bc6553d9c89cba6d34853b27cb49746a6499a0019e510397df39d01bcf9724a73ff6400d9d7724a030c1c')
sig = HexBytes(signed)
print(sig)
print(message)
print(w3.eth.account.recover_message(message, signature=sig))