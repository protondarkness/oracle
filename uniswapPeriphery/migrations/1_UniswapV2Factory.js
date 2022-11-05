const UniswapV2Factory = artifacts.require("UniswapV2Factory");

module.exports = function (deployer,network, accounts) {
    const userAddress = accounts[0];
  deployer.deploy(UniswapV2Factory,userAddress);
};
