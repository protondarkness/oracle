# Configure w3, e.g., w3 = Web3(...)
import web3
from eth_account.messages import encode_defunct
from web3 import Web3, EthereumTesterProvider
import json
#w3 = Web3(EthereumTesterProvider())
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))
w3.isConnected()
print(w3.isConnected())
#address of contract
address = '0x827cff43DA007834Ad01018F11244182B0400678'
abi = '/home/darkproton/Desktop/truffle/oracle/client/src/contracts/TimestampRequestOracle.json'

jsonfile=open(abi)
abi_data=json.load(jsonfile)['abi']
#print(abi_data)
contract_instance = w3.eth.contract(address=address, abi=abi_data)


# 3. Create address variables
account_from = {
    "private_key": "cf0629f734b41dc8486325d45ff74537d4352f3fd9f0e5d0cc29e795d7ff4c0b",
    "address": "0xC109f6944e282d0C02742115EA0343a9a85eEA6f",
}
# address_to = "ADDRESS-TO-HERE"
#
# print(
#     f'Attempting to send transaction from { account_from["address"] } to { address_to }'
# )
#
# # 4. Set the gas price strategy
# web3.eth.set_gas_price_strategy(rpc_gas_price_strategy)
#
# # 5. Sign tx with PK
# tx_create = web3.eth.account.sign_transaction(
#     {
#         "nonce": web3.eth.get_transaction_count(account_from["address"]),
#         "gasPrice": web3.eth.generate_gas_price(),
#         "gas": 21000,
#         "to": address_to,
#         "value": web3.toWei("1", "ether"),
#     },
#     account_from["private_key"],
# )
Incrementer = w3.eth.contract(address=address, abi=abi_data)
increment_tx = Incrementer.functions.setTimestamp(666).buildTransaction(
    {
        "gasPrice": w3.eth.gas_price,
        'from': account_from['address'],
        'nonce': w3.eth.get_transaction_count(account_from['address']),
    }
)

# 6. Sign tx with PK
tx_create = w3.eth.account.sign_transaction(increment_tx, account_from['private_key'])
print(tx_create)
# 7. Send tx and wait for receipt
tx_hash = w3.eth.send_raw_transaction(tx_create.rawTransaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
message = encode_defunct(text="twitter")
signature = w3.eth.account.sign_message(message, account_from['private_key'])
print(f'Tx successful with hash: { tx_receipt.transactionHash.hex() }')
print(signature)
#signing with private key
#const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);