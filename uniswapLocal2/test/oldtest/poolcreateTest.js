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
    const [owner] = await ethers.getSigners();

    const transactionHash = await owner.sendTransaction({
    to: pool_att.address,
    value: ethers.utils.parseEther("12.0"), // Sends exactly 1.0 ether
});
    return { pool_att,IUniswapV2Factory_address ,owner};
  }
  describe("Pool Create", function (){
  it("Create pool and init supply", async function () {
  // ...deploy the contract as before...
    const {pool_att } = await loadFixture(CreatePool);
    await expect(pool_att.poolCreate());
    });
    });
    describe("Check pool funding", function(){
    it("check on pool supply", async function () {
  // ...deploy the contract as before...
    const {pool_att } = await loadFixture(CreatePool);
    await expect(pool_att.getPoolStats());
    });
    });
    it("check time", async function () {
  // ...deploy the contract as before...
    const {pool_att } = await loadFixture(CreatePool);
//    const timer = await expect(pool_att.getBocktime());

//    dt=new Date(timer * 1000).toLocaleString();
//    console.log(dt);
    });

    describe("Events", function () {
      it("Should emit an event on checking pool", async function () {
        const {pool_att ,IUniswapV2Factory_address} = await loadFixture(CreatePool);
    await expect(pool_att.getPoolStats(IUniswapV2Factory_address)).to.emit(pool_att, "balances"); // We accept any value as `when` arg
      });
    });
    describe("buy try", function () {
      it("Should emit an event on checking pool", async function () {
        const {pool_att ,IUniswapV2Factory_address} = await loadFixture(CreatePool);
        const [owner, add1, add2,add3] = await ethers.getSigners();

        timer =await (pool_att.getBocktime());
        //dt=new Date(timer * 1000).toLocaleString();
        console.log(timer);
        await network.provider.send("evm_setNextBlockTimestamp", [1676181772])
         await expect(pool_att.connect(add1).buySome({ value: 1 })).to.be.revertedWith(
        "not time!"
      );
        await network.provider.send("evm_setNextBlockTimestamp", [1676181769+18840])
        await network.provider.send("evm_mine");

        dt=new Date(timer * 1000).toLocaleString();
        console.log(dt);
        await expect(pool_att.connect(add1).buySome({ value: 0 })).to.be.revertedWith(
        "need more eth!"
      );
        await expect(pool_att.connect(add1).buySome({ value: 1 }));

      });
    });
});
