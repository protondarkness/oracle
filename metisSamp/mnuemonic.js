
const ethers = require('ethers');
let mnemonic = "icon action primary north series okay zoo arm winner medal priority calm";
let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
console.log(mnemonicWallet.privateKey);