var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const metis = "0x9E32b13ce7f2E80A01932B42553652E053D6ed8e";
web3.eth.getAccounts(console.log);
web3.eth.getStorageAt(metis,"0x000000000000000000000000000000000000000000084595161401484a000000").then(console.log);