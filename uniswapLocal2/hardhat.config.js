require("@nomicfoundation/hardhat-toolbox");
const ALCHEMY_KEY = 'PoEWVXu-9Ogwqr6iq0KWWQvcBNCRYh8p';


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
    {
    version:"0.8.17",
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
      url: 'https://eth-mainnet.g.alchemy.com/v2/PoEWVXu-9Ogwqr6iq0KWWQvcBNCRYh8p',
      blockNumber: 	16093044,
    }
        },
//    mainnet: {
//        url: 'https://eth-mainnet.g.alchemy.com/v2/PoEWVXu-9Ogwqr6iq0KWWQvcBNCRYh8p'
//        },

    }
}