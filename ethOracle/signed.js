

import MetaMaskOnboarding from '@metamask/onboarding';
// eslint-disable-next-line camelcase
import 'eth-sig-util';
import  'ethers';
//import { toChecksumAddress } from 'ethereumjs-util';
//import 'web3' ;

const currentUrl = new URL(window.location.href);
const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');
const errorConnected = document.getElementById('errorConnected');
const signAccount = document.getElementById('signAccount');
const vote  = document.getElementById('Vote');
const network  = document.getElementById('network');
const MetisChainID = '0x440';
var chainId;
var networkId;
var accounts;
var encryptMessageInput = document.getElementById('encryptMessageInput');
//let accounts;
//window.onload = function(){
//getNetworkAndChainId();
//
//}

ethereumButton.addEventListener('click', () => {
  getAccount();
});

//ethereum.on('accountsChanged', function (accounts) {
//  // Time to reload your interface with accounts[0]!
//});

async function getAccount() {
if(window.ethereum){
        try {
        getNetworkAndChainId();
  accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  showAccount.innerHTML = account;
  errorConnected.innerHTML = 'Connected'
  errorConnected.style.color = 'blue';
  } catch (err) {
      console.error(err);
    }
}else{
    errorConnected.display = 'inline';
    errorConnected.innerHtml = 'Not Connected'
    errorConnected.color = 'red';
    }
}

 async function getNetworkAndChainId() {
 if (window.ethereum) {
    try {
      switchToMetis();
      //handleNewChain(chainId);
      let current_chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
        network.value = current_chainId;
       networkId = await window.ethereum.request({
        method: 'net_version',
      });
      //handleNewNetwork(networkId);

    //console.log( chainId);
//      handleEIP1559Support(block.baseFeePerGas !== undefined);
    } catch (err) {
      console.error(err);
    }
    }else{
    console.error('err2');
    }
  }


  signTypedDataV4Button.onclick = async () => {
    const exampleMessage = encryptMessageInput.value;
    if (window.ethereum) {
    try {
      const from = accounts[0];
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = await window.ethereum.request({
        method: 'personal_sign',
        params: [msg, from, ''],
      });
      signTypedDataResult.value = sign;
      signAccount.value = from;
      vote.value = exampleMessage;
     // personalSignVerify.disabled = false;
    } catch (err) {
      console.error(err);
      signTypedDataResult.value = `Error: ${err.message}`;
    }
  }else{
    console.error('err3');
    }
  }

  async function  switchToMetis(){

        let ethereum = window.ethereum;
        const data = [{
            chainId: MetisChainID,
            chainName: 'Metis Andromeda Mainnet',
            nativeCurrency:
                {
                    name: 'Metis',
                    symbol: 'Metis',
                    decimals: 18
                },
           blockExplorerUrls: ['https://andromeda-explorer.metis.io/'],
            rpcUrls: ['https://andromeda.metis.io/?owner=1088'],
        }]
        /* eslint-disable */
        const tx = await ethereum.request({method: 'wallet_addEthereumChain', params:data}).catch()
        if (tx) {
            console.log(tx)
        }
    }