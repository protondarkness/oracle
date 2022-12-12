const EthCrypto = require("eth-crypto");
const signerIdentity = EthCrypto.createIdentity();
const message = EthCrypto.hash.keccak256([
{type: "string",value: "Hello World!"}
]);
const signature = EthCrypto.sign(signerIdentity.privateKey, message);
console.log(`message: ${message}`);
console.log(`signature: ${signature}`);
console.log(`signer public key: ${signerIdentity.address}`);