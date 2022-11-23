require("@nomicfoundation/hardhat-toolbox");
const ALCHEMY_KEY = 'PoEWVXu-9Ogwqr6iq0KWWQvcBNCRYh8p';


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
    },
    mainnet: {
    url: 'https://eth-mainnet.g.alchemy.com/v2/PoEWVXu-9Ogwqr6iq0KWWQvcBNCRYh8p';
    },
   settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
};
