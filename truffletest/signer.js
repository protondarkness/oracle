const EthCrypto = require("eth-crypto");
const signerIdentity = EthCrypto.createIdentity();
const message = EthCrypto.hash.keccak256([
{type: "string",value: "bal-cle-m7.5-092222"}
]);
const signature = EthCrypto.sign(signerIdentity.privateKey, message);
console.log(`message: ${message}`);
console.log(`signature: ${signature}`);
console.log(`signer public key: ${signerIdentity.address}`);
