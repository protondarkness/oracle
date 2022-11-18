require("@nomicfoundation/hardhat-toolbox");
//require('dotenv').config();
//require("@nomiclabs/hardhat-ethers");
//
//const { API_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.6.6",

networks: {
  hardhat: {
    forking: {
      url: "https://eth-mainnet.g.alchemy.com/v2/PoEWVXu-9Ogwqr6iq0KWWQvcBNCRYh8p",
      blockNumber: 14189520
    }
  }
}



};

