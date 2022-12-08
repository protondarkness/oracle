import React from "react";
import ReactDOM from 'react-dom/client';
require('@metamask/onboarding');
require('web3');
require('eth-sig-util');


const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');
var chainId;
var networkId;
var accounts;
var encryptMessageInput = document.getElementById('encryptMessageInput');
const signTypedDataResult = document.getElementById('signTypedDataResult');

//let accounts;
window.onload = function(){
getNetworkAndChainId();
getAccount();
}
const { ethereum } = window;
ethereumButton.addEventListener('click', () => {
  getAccount();
});

//ethereum.on('accountsChanged', function (accounts) {
//  // Time to reload your interface with accounts[0]!
//});

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  showAccount.innerHTML = account;
}

 async function getNetworkAndChainId() {
    try {
       chainId = await ethereum.request({
        method: 'eth_chainId',
      });
      //handleNewChain(chainId);

       networkId = await ethereum.request({
        method: 'net_version',
      });
      //handleNewNetwork(networkId);

      const block = await ethereum.request({
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
      });
    console.log("im horny "+ chainId);
//      handleEIP1559Support(block.baseFeePerGas !== undefined);
    } catch (err) {
      console.error(err);
    }
  }


  signTypedDataV4Button.onclick = async () => {
    const exampleMessage = encryptMessageInput.value;
    try {
      const from = accounts[0];
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = await ethereum.request({
        method: 'personal_sign',
        params: [msg, from, ''],
      });
      signTypedDataResult.innerHTML = sign;
     // personalSignVerify.disabled = false;
    } catch (err) {
      console.error(err);
      signTypedDataResult.innerHTML = `Error: ${err.message}`;
    }
  };
