const UniswapV2Router02 = artifacts.require("UniswapV2Router02");

module.exports = function (deployer) {
    const wethAddress =  '0x06F6015E1559B48E50C0405CcbF64406969e6ac0';
    const uniswapFactoryAddress = '0xce66A545c592f7ec020B74283974f174782952dF';
  deployer.deploy(UniswapV2Router02, uniswapFactoryAddress, wethAddress);
};
