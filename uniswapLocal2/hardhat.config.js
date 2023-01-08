require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
 gasReporter: {
enabled: true,
currency: "USD", // currency to show
outputFile: "gas-report.txt", // optional
noColors: true, //optional
coinmarketcap: process.env.COINMARKETCAP_KEY
},
  solidity: {
    compilers: [
    {
    version:"0.8.17",
    },
    {
    version:"0.6.12",
    },
    {
    version:"0.6.6",
    }
        ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
            },
        },
      },
  networks: {
    hardhat: {
        forking: {
      url: 'https://eth-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_KEY ,
      blockNumber: 	16003044,
    }

        },
        metis_fork: {
    gasPrice: 225000000000,
    url: "https://goerli.gateway.metisdevops.link",
    forking: {
        url: "https://goerli.gateway.metisdevops.link",
        enabled: true,
        blockNumber: 16003044,
    },
    accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 20
    }
},
metis: {
    url: "https://goerli.gateway.metisdevops.link",
    accounts:
    process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],

    },
//        metis_testnet: {
//            url:  "https://metis-rpc.gateway.pokt.network",
//        },
//        metis_mainnet: {
//            url: "https://andromeda.metis.io/?owner=1088",
//        },
//    mainnet: {
//        url: 'https://eth-mainnet.g.alchemy.com/v2/PoEWVXu-9Ogwqr6iq0KWWQvcBNCRYh8p'
//        },

    }
}