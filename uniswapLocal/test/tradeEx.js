const { assert } = require("chai");
const { ethers } = require("hardhat");
const ERC20ABI = require('../scripts/erc20.abi.json');

const UNISWAPV2ROUTER02_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

describe("UniswapTradeExample", function () {
    it("Swap ETH for DAI", async function () {
        const provider = ethers.provider;
        const [owner, addr1] = await ethers.getSigners();
        const DAI = new ethers.Contract(DAI_ADDRESS, ERC20ABI, provider);

        // Assert addr1 has 1000 ETH to start
        addr1Balance = await provider.getBalance(addr1.address);
        expectedBalance = ethers.BigNumber.from("10000000000000000000000");
        assert(addr1Balance.eq(expectedBalance));

        // Assert addr1 DAI balance is 0
        addr1Dai = await DAI.balanceOf(addr1.address);
        assert(addr1Dai.isZero());

        // Deploy UniswapTradeExample
        const uniswapTradeExample =
            await ethers.getContractFactory("UniswapTradeExample")
                .then(contract => contract.deploy(UNISWAPV2ROUTER02_ADDRESS));
        await uniswapTradeExample.deployed();

        // Swap 1 ETH for DAI
        await uniswapTradeExample.connect(addr1).swapExactETHForTokens(
            0,
            DAI_ADDRESS,
            { value: ethers.utils.parseEther("1") }
        );

        // Assert addr1Balance contains one less ETH
        expectedBalance = addr1Balance.sub(ethers.utils.parseEther("1"));
        addr1Balance = await provider.getBalance(addr1.address);
        assert(addr1Balance.lt(expectedBalance));

        // Assert DAI balance increased
        addr1Dai = await DAI.balanceOf(addr1.address);
        assert(addr1Dai.gt(ethers.BigNumber.from("0")));
    });
});