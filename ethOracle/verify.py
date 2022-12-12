from web3 import Web3, EthereumTesterProvider
import json
from eth_account.messages import encode_defunct
#w3 = Web3(EthereumTesterProvider())
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
w3.isConnected()
print(w3.isConnected())
#address of contract
address = '0xeAc8e8A7aDD748202A0e1b1A628449e32B6e60C1'
abi = './Verify.json'

account_from = {
    "private_key": "cf0629f734b41dc8486325d45ff74537d4352f3fd9f0e5d0cc29e795d7ff4c0b",
    "address": "0xC109f6944e282d0C02742115EA0343a9a85eEA6f",
}

from web3 import Web3

# ecrecover in Solidity expects v as a native uint8, but r and s as left-padded bytes32
# Remix / web3.js expect r and s to be encoded to hex
# This convenience method will do the pad & hex for us:
message = encode_defunct(text="twitter")
signed_message = w3.eth.account.sign_message(message, account_from['private_key'])
def to_32byte_hex(val):
   return Web3.toHex(Web3.toBytes(val).rjust(32, b'\0'))

ec_recover_args = (msghash, v, r, s) = ( Web3.toHex(signed_message.messageHash),
  signed_message.v,
  to_32byte_hex(signed_message.r),
  to_32byte_hex(signed_message.s),
)
#abi = '/home/darkproton/Desktop/truffle/oracle/client/src/contracts/Verify.json'

jsonfile=open(abi)
abi_data=json.load(jsonfile)['abi']
Incrementer = w3.eth.contract(address=address, abi=abi_data)
msgH = '0x9ad685600708847858a54b6dbd853aaf381268abcb43b59cec981345b58d8278'
sig ='0x4e0a5eb5a2c73d0fc31b4b9f3e2d616b4ec4e08cdecc379556d4b80f9466cef84812ae76bb94b72b57f57a25262028c053d3ef835e595e64f56820ff05af85601c'
raw_balance = Incrementer.functions.recoverSigner(msgH,sig).call()
print(raw_balance)
# increment_tx = Incrementer.functions.recoverSigner(msgH,sig).buildTransaction(
#     {
#         "gasPrice": w3.eth.gas_price,
#         'from': account_from['address'],
#         'nonce': w3.eth.get_transaction_count(account_from['address']),
#     }
# )
#
# # 6. Sign tx with PK
# tx_create = w3.eth.account.sign_transaction(increment_tx, account_from['private_key'])
# print(tx_create)
# # 7. Send tx and wait for receipt
# tx_hash = w3.eth.send_raw_transaction(tx_create.rawTransaction)
# print(tx_hash)
# tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
# print(tx_receipt)