const { expect } = require("chai");
const hre = require("hardhat");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

describe("CreatePoolAttempt", function () {
  async function CreatePool() {
    const  IUniswapV2Factory_address = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // uniswap v2 factory on ethereum mainnet
    const IUniswapV2Router02_address ='0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    const Pool_att = await hre.ethers.getContractFactory("CreatePoolAttempt");
    const pool_att = await Pool_att.deploy(IUniswapV2Router02_address,IUniswapV2Factory_address);

    return { pool_att };
  }
  it("Create pool and init supply", async function () {
  // ...deploy the contract as before...
    const {pool_att } = await loadFixture(CreatePool);
    await expect(pool_att.poolCreate());
});
});
