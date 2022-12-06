import MetaMaskOnboarding from '@metamask/onboarding';
// eslint-disable-next-line camelcase
import {
  encrypt,
  recoverPersonalSignature,
  recoverTypedSignatureLegacy,
  recoverTypedSignature,
  recoverTypedSignature_v4 as recoverTypedSignatureV4,
} from 'eth-sig-util';
import { ethers } from 'ethers';
import { toChecksumAddress } from 'ethereumjs-util';
import {
  hstBytecode,
  hstAbi,
  piggybankBytecode,
  piggybankAbi,
  collectiblesAbi,
  collectiblesBytecode,
  failingContractAbi,
  failingContractBytecode,
} from './constants.json';

let ethersProvider;
let hstFactory;
let piggybankFactory;
let collectiblesFactory;
let failingContractFactory;
let hstContract;
let piggybankContract;
let collectiblesContract;
let failingContract;

const currentUrl = new URL(window.location.href);
const forwarderOrigin =
  currentUrl.hostname === 'localhost' ? 'http://localhost:9010' : undefined;
const urlSearchParams = new URLSearchParams(window.location.search);
const deployedContractAddress = urlSearchParams.get('contract');

const { isMetaMaskInstalled } = MetaMaskOnboarding;

// Dapp Status Section
const networkDiv = document.getElementById('network');
const chainIdDiv = document.getElementById('chainId');
const accountsDiv = document.getElementById('accounts');
const warningDiv = document.getElementById('warning');

// Basic Actions Section
const onboardButton = document.getElementById('connectButton');
const getAccountsButton = document.getElementById('getAccounts');
const getAccountsResults = document.getElementById('getAccountsResult');

// Permissions Actions Section
const requestPermissionsButton = document.getElementById('requestPermissions');
const getPermissionsButton = document.getElementById('getPermissions');
const permissionsResult = document.getElementById('permissionsResult');

// Contract Section
//const deployButton = document.getElementById('deployButton');
//const depositButton = document.getElementById('depositButton');
//const withdrawButton = document.getElementById('withdrawButton');
//const contractStatus = document.getElementById('contractStatus');
//const deployFailingButton = document.getElementById('deployFailingButton');
//const sendFailingButton = document.getElementById('sendFailingButton');
//const failingContractStatus = document.getElementById('failingContractStatus');

// Collectibles Section
//const deployCollectiblesButton = document.getElementById(
//  'deployCollectiblesButton',
//);
//const mintButton = document.getElementById('mintButton');
//const mintAmountInput = document.getElementById('mintAmountInput');
//const approveTokenInput = document.getElementById('approveTokenInput');
//const approveButton = document.getElementById('approveButton');
//const setApprovalForAllButton = document.getElementById(
//  'setApprovalForAllButton',
//);
//const revokeButton = document.getElementById('revokeButton');
//const transferTokenInput = document.getElementById('transferTokenInput');
//const transferFromButton = document.getElementById('transferFromButton');
//const collectiblesStatus = document.getElementById('collectiblesStatus');
//
//// Send Eth Section

//const sendButton = document.getElementById('sendButton');
const sendEIP1559Button = document.getElementById('sendEIP1559Button');
//
//// Send Tokens Section
//const decimalUnits = 4;
//const tokenSymbol = 'TST';
//const tokenAddress = document.getElementById('tokenAddress');
//const createToken = document.getElementById('createToken');
//const watchAsset = document.getElementById('watchAsset');
//const transferTokens = document.getElementById('transferTokens');
//const approveTokens = document.getElementById('approveTokens');
//const transferTokensWithoutGas = document.getElementById(
//  'transferTokensWithoutGas',
//);
//const approveTokensWithoutGas = document.getElementById(
//  'approveTokensWithoutGas',
//);
//
//// Encrypt / Decrypt Section
//const getEncryptionKeyButton = document.getElementById(
//  'getEncryptionKeyButton',
//);
//const encryptMessageInput = document.getElementById('encryptMessageInput');
//const encryptButton = document.getElementById('encryptButton');
//const decryptButton = document.getElementById('decryptButton');
//const encryptionKeyDisplay = document.getElementById('encryptionKeyDisplay');
//const ciphertextDisplay = document.getElementById('ciphertextDisplay');
//const cleartextDisplay = document.getElementById('cleartextDisplay');

// Ethereum Signature Section
const ethSign = document.getElementById('ethSign');
const ethSignResult = document.getElementById('ethSignResult');
const personalSign = document.getElementById('personalSign');
const personalSignResult = document.getElementById('personalSignResult');
const personalSignVerify = document.getElementById('personalSignVerify');
const personalSignVerifySigUtilResult = document.getElementById(
  'personalSignVerifySigUtilResult',
);
const personalSignVerifyECRecoverResult = document.getElementById(
  'personalSignVerifyECRecoverResult',
);
const signTypedData = document.getElementById('signTypedData');
const signTypedDataResult = document.getElementById('signTypedDataResult');
const signTypedDataVerify = document.getElementById('signTypedDataVerify');
const signTypedDataVerifyResult = document.getElementById(
  'signTypedDataVerifyResult',
);
const signTypedDataV3 = document.getElementById('signTypedDataV3');
const signTypedDataV3Result = document.getElementById('signTypedDataV3Result');
const signTypedDataV3Verify = document.getElementById('signTypedDataV3Verify');
const signTypedDataV3VerifyResult = document.getElementById(
  'signTypedDataV3VerifyResult',
);
const signTypedDataV4 = document.getElementById('signTypedDataV4');
const signTypedDataV4Result = document.getElementById('signTypedDataV4Result');
const signTypedDataV4Verify = document.getElementById('signTypedDataV4Verify');
const signTypedDataV4VerifyResult = document.getElementById(
  'signTypedDataV4VerifyResult',
);

// Send form section
const fromDiv = document.getElementById('fromInput');
//const toDiv = document.getElementById('toInput');
//const type = document.getElementById('typeInput');
//const amount = document.getElementById('amountInput');
//const gasPrice = document.getElementById('gasInput');
//const maxFee = document.getElementById('maxFeeInput');
//const maxPriority = document.getElementById('maxPriorityFeeInput');
//const data = document.getElementById('dataInput');
//const gasPriceDiv = document.getElementById('gasPriceDiv');
//const maxFeeDiv = document.getElementById('maxFeeDiv');
//const maxPriorityDiv = document.getElementById('maxPriorityDiv');
//const submitFormButton = document.getElementById('submitForm');

// Miscellaneous
//const addEthereumChain = document.getElementById('addEthereumChain');
//const switchEthereumChain = document.getElementById('switchEthereumChain');

const initialize = async () => {
  try {
    // We must specify the network as 'any' for ethers to allow network changes
    ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'any');

  } catch (error) {
    console.error(error);
  }

  let onboarding;
  try {
    onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  } catch (error) {
    console.error(error);
  }

  let accounts;
  let accountButtonsInitialized = false;

  const accountButtons = [
//    deployButton,
//    depositButton,
//    withdrawButton,
//    deployCollectiblesButton,
//    mintButton,
//    mintAmountInput,
//    approveTokenInput,
//    approveButton,
//    setApprovalForAllButton,
//    revokeButton,
//    transferTokenInput,
//    transferFromButton,
//    deployFailingButton,
//    sendFailingButton,
//    sendButton,
//    createToken,
//    watchAsset,
//    transferTokens,
//    approveTokens,
//    transferTokensWithoutGas,
//    approveTokensWithoutGas,
//    getEncryptionKeyButton,
//    encryptMessageInput,
//    encryptButton,
//    decryptButton,
    ethSign,
    personalSign,
    personalSignVerify,
    signTypedData,
    signTypedDataVerify,
    signTypedDataV3,
    signTypedDataV3Verify,
    signTypedDataV4,
    signTypedDataV4Verify,
  ];

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      handleNewAccounts(newAccounts);
    } catch (error) {
      console.error(error);
    }
  };

//  const clearTextDisplays = () => {
//    encryptionKeyDisplay.innerText = '';
//    encryptMessageInput.value = '';
//    ciphertextDisplay.innerText = '';
//    cleartextDisplay.innerText = '';
//  };

  const updateButtons = () => {
    const accountButtonsDisabled =
      !isMetaMaskInstalled() || !isMetaMaskConnected();
    if (accountButtonsDisabled) {
      for (const button of accountButtons) {
        button.disabled = true;
      }
    //  clearTextDisplays();
    } else {
      deployButton.disabled = false;
      deployCollectiblesButton.disabled = false;
      sendButton.disabled = false;
      deployFailingButton.disabled = false;
      createToken.disabled = false;
      personalSign.disabled = false;
      signTypedData.disabled = false;
      getEncryptionKeyButton.disabled = false;
      ethSign.disabled = false;
      personalSign.disabled = false;
      signTypedData.disabled = false;
      signTypedDataV3.disabled = false;
      signTypedDataV4.disabled = false;
    }

    if (isMetaMaskInstalled()) {
//      addEthereumChain.disabled = false;
//      switchEthereumChain.disabled = false;
    } else {
      onboardButton.innerText = 'Click here to install MetaMask!';
      onboardButton.onclick = onClickInstall;
      onboardButton.disabled = false;
    }

    if (isMetaMaskConnected()) {
      onboardButton.innerText = 'Connected';
      onboardButton.disabled = true;
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      onboardButton.innerText = 'Connect';
      onboardButton.onclick = onClickConnect;
      onboardButton.disabled = false;
    }

//    if (deployedContractAddress) {
//      // Piggy bank contract
//      contractStatus.innerHTML = 'Deployed';
//      depositButton.disabled = false;
//      withdrawButton.disabled = false;
//      // Failing contract
//      failingContractStatus.innerHTML = 'Deployed';
//      sendFailingButton.disabled = false;
//      // ERC721 Token - Collectibles contract
//      collectiblesStatus.innerHTML = 'Deployed';
//      mintButton.disabled = false;
//      mintAmountInput.disabled = false;
//      approveTokenInput.disabled = false;
//      approveButton.disabled = false;
//      setApprovalForAllButton.disabled = false;
//      revokeButton.disabled = false;
//      transferTokenInput.disabled = false;
//      transferFromButton.disabled = false;
//      // ERC20 Token - Send Tokens
//      tokenAddress.innerHTML = hstContract.address;
//      watchAsset.disabled = false;
//      transferTokens.disabled = false;
//      approveTokens.disabled = false;
//      transferTokensWithoutGas.disabled = false;
//      approveTokensWithoutGas.disabled = false;
//    }
  };

//  addEthereumChain.onclick = async () => {
//    await ethereum.request({
//      method: 'wallet_addEthereumChain',
//      params: [
//        {
//          chainId: '0x53a',
//          rpcUrls: ['http://127.0.0.1:8546'],
//          chainName: 'Localhost 8546',
//          nativeCurrency: { name: 'TEST', decimals: 18, symbol: 'TEST' },
//          blockExplorerUrls: null,
//        },
//      ],
//    });
//  };

//  switchEthereumChain.onclick = async () => {
//    await ethereum.request({
//      method: 'wallet_switchEthereumChain',
//      params: [
//        {
//          chainId: '0x53a',
//        },
//      ],
//    });
//  };

  const initializeAccountButtons = () => {
    if (accountButtonsInitialized) {
      return;
    }
    accountButtonsInitialized = true;

    /**
     * Piggy bank
     */

//    deployButton.onclick = async () => {
//      contractStatus.innerHTML = 'Deploying';
//
//      try {
//        piggybankContract = await piggybankFactory.deploy();
//        await piggybankContract.deployTransaction.wait();
//      } catch (error) {
//        contractStatus.innerHTML = 'Deployment Failed';
//        throw error;
//      }
//
//      if (piggybankContract.address === undefined) {
//        return;
//      }
//
//      console.log(
//        `Contract mined! address: ${piggybankContract.address} transactionHash: ${piggybankContract.deployTransaction.hash}`,
//      );
//      contractStatus.innerHTML = 'Deployed';
//      depositButton.disabled = false;
//      withdrawButton.disabled = false;
//    };
//
//    depositButton.onclick = async () => {
//      contractStatus.innerHTML = 'Deposit initiated';
//      const result = await piggybankContract.deposit({
//        from: accounts[0],
//        value: '0x3782dace9d900000',
//      });
//      console.log(result);
//      const receipt = await result.wait();
//      console.log(receipt);
//      contractStatus.innerHTML = 'Deposit completed';
//    };
//
//    withdrawButton.onclick = async () => {
//      const result = await piggybankContract.withdraw('0xde0b6b3a7640000', {
//        from: accounts[0],
//      });
//      console.log(result);
//      const receipt = await result.wait();
//      console.log(receipt);
//      contractStatus.innerHTML = 'Withdrawn';
//    };

    /**
     * Failing
     */

//    deployFailingButton.onclick = async () => {
//      failingContractStatus.innerHTML = 'Deploying';
//
//      try {
//        failingContract = await failingContractFactory.deploy();
//        await failingContract.deployTransaction.wait();
//      } catch (error) {
//        failingContractStatus.innerHTML = 'Deployment Failed';
//        throw error;
//      }
//
//      if (failingContract.address === undefined) {
//        return;
//      }
//
//      console.log(
//        `Contract mined! address: ${failingContract.address} transactionHash: ${failingContract.deployTransaction.hash}`,
//      );
//      failingContractStatus.innerHTML = 'Deployed';
//      sendFailingButton.disabled = false;
//    };
//
//    sendFailingButton.onclick = async () => {
//      try {
//        const result = await ethereum.request({
//          method: 'eth_sendTransaction',
//          params: [
//            {
//              from: accounts[0],
//              to: failingContract.address,
//              value: '0x0',
//              gasLimit: '0x5028',
//              maxFeePerGas: '0x2540be400',
//              maxPriorityFeePerGas: '0x3b9aca00',
//            },
//          ],
//        });
//        failingContractStatus.innerHTML =
//          'Failed transaction process completed as expected.';
//        console.log('send failing contract result', result);
//      } catch (error) {
//        console.log('error', error);
//        throw error;
//      }
//    };

    /**
     * ERC721 Token
     */




    /**
     * Sending ETH
     */






    /**
     * Permissions
     */



    getAccountsButton.onclick = async () => {
      try {
        const _accounts = await ethereum.request({
          method: 'eth_accounts',
        });
        getAccountsResults.innerHTML =
          _accounts[0] || 'Not able to get accounts';
      } catch (err) {
        console.error(err);
        getAccountsResults.innerHTML = `Error: ${err.message}`;
      }
    };

    /**
     * Encrypt / Decrypt
     */


  };

//  type.onchange = async () => {
//    if (type.value === '0x0') {
//      gasPriceDiv.style.display = 'block';
//      maxFeeDiv.style.display = 'none';
//      maxPriorityDiv.style.display = 'none';
//    } else {
//      gasPriceDiv.style.display = 'none';
//      maxFeeDiv.style.display = 'block';
//      maxPriorityDiv.style.display = 'block';
//    }
//  };



  /**
   * Personal Sign
   */
  personalSign.onclick = async () => {
    const exampleMessage = 'Example `personal_sign` message';
    try {
      const from = accounts[0];
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = await ethereum.request({
        method: 'personal_sign',
        params: [msg, from, 'Example password'],
      });
      personalSignResult.innerHTML = sign;
      personalSignVerify.disabled = false;
    } catch (err) {
      console.error(err);
      personalSign.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   * Personal Sign Verify
   */
  personalSignVerify.onclick = async () => {
    const exampleMessage = 'Example `personal_sign` message';
    try {
      const from = accounts[0];
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = personalSignResult.innerHTML;
      const recoveredAddr = recoverPersonalSignature({
        data: msg,
        sig: sign,
      });
      if (recoveredAddr === from) {
        console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`);
        personalSignVerifySigUtilResult.innerHTML = recoveredAddr;
      } else {
        console.log(
          `SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
        );
        console.log(`Failed comparing ${recoveredAddr} to ${from}`);
      }
      const ecRecoverAddr = await ethereum.request({
        method: 'personal_ecRecover',
        params: [msg, sign],
      });
      if (ecRecoverAddr === from) {
        console.log(`Successfully ecRecovered signer as ${ecRecoverAddr}`);
        personalSignVerifyECRecoverResult.innerHTML = ecRecoverAddr;
      } else {
        console.log(
          `Failed to verify signer when comparing ${ecRecoverAddr} to ${from}`,
        );
      }
    } catch (err) {
      console.error(err);
      personalSignVerifySigUtilResult.innerHTML = `Error: ${err.message}`;
      personalSignVerifyECRecoverResult.innerHTML = `Error: ${err.message}`;
    }
  };

  /**
   * Sign Typed Data Test
   */


  /**
   * Sign Typed Data V3 Verification
   */


  function handleNewAccounts(newAccounts) {
    accounts = newAccounts;
    accountsDiv.innerHTML = accounts;
    fromDiv.value = accounts;
    gasPriceDiv.style.display = 'block';
    maxFeeDiv.style.display = 'none';
    maxPriorityDiv.style.display = 'none';
    if (isMetaMaskConnected()) {
      initializeAccountButtons();
    }
    updateButtons();
  }

  function handleNewChain(chainId) {
    chainIdDiv.innerHTML = chainId;

    if (chainId === '0x1') {
      warningDiv.classList.remove('warning-invisible');
    } else {
      warningDiv.classList.add('warning-invisible');
    }
  }

//  function handleEIP1559Support(supported) {
//    if (supported && Array.isArray(accounts) && accounts.length >= 1) {
//      sendEIP1559Button.disabled = false;
//      sendEIP1559Button.hidden = false;
//      sendButton.innerText = 'Send Legacy Transaction';
//    } else {
//      sendEIP1559Button.disabled = true;
//      sendEIP1559Button.hidden = true;
//      sendButton.innerText = 'Send';
//    }
//  }

  function handleNewNetwork(networkId) {
    networkDiv.innerHTML = networkId;
  }

//  async function getNetworkAndChainId() {
//    try {
//      const chainId = await ethereum.request({
//        method: 'eth_chainId',
//      });
//      handleNewChain(chainId);
//
//      const networkId = await ethereum.request({
//        method: 'net_version',
//      });
//      handleNewNetwork(networkId);
//
//      const block = await ethereum.request({
//        method: 'eth_getBlockByNumber',
//        params: ['latest', false],
//      });
//
//      handleEIP1559Support(block.baseFeePerGas !== undefined);
//    } catch (err) {
//      console.error(err);
//    }
//  }

  updateButtons();

//  if (isMetaMaskInstalled()) {
//    ethereum.autoRefreshOnNetworkChange = false;
//    getNetworkAndChainId();
//
//    ethereum.autoRefreshOnNetworkChange = false;
//    getNetworkAndChainId();
//
//    ethereum.on('chainChanged', (chain) => {
//      handleNewChain(chain);
//      ethereum
//        .request({
//          method: 'eth_getBlockByNumber',
//          params: ['latest', false],
//        })
//        .then((block) => {
//          handleEIP1559Support(block.baseFeePerGas !== undefined);
//        });
//    });
//    ethereum.on('chainChanged', handleNewNetwork);
//    ethereum.on('accountsChanged', (newAccounts) => {
//      ethereum
//        .request({
//          method: 'eth_getBlockByNumber',
//          params: ['latest', false],
//        })
//        .then((block) => {
//          handleEIP1559Support(block.baseFeePerGas !== undefined);
//        });
//      handleNewAccounts(newAccounts);
//    });
//
//    try {
//      const newAccounts = await ethereum.request({
//        method: 'eth_accounts',
//      });
//      handleNewAccounts(newAccounts);
//    } catch (err) {
//      console.error('Error on init when getting accounts', err);
//    }
//  }
};

window.addEventListener('load', initialize);

// utils

function getPermissionsDisplayString(permissionsArray) {
  if (permissionsArray.length === 0) {
    return 'No permissions found.';
  }
  const permissionNames = permissionsArray.map((perm) => perm.parentCapability);
  return permissionNames
    .reduce((acc, name) => `${acc}${name}, `, '')
    .replace(/, $/u, '');
}

function stringifiableToHex(value) {
  return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)));
}
