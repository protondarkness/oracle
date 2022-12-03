const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const  hre = require("hardhat");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

describe("Create ICO", function () {
  async function CreatePool() {
    //const  IUniswapV2Factory_address = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // uniswap v2 factory on ethereum mainnet
    //const IUniswapV2Router02_address ='0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    const EFT = await hre.ethers.getContractFactory("EFTT");
    const eft = await EFT.deploy();
    const Pool_att = await hre.ethers.getContractFactory("efftICO");

    const [owner] = await ethers.getSigners();
    console.log("Token owner:", owner.address);
    const pool_att = await Pool_att.deploy(eft.address,owner.address);

//    const transactionHash = await owner.sendTransaction({
//    to: pool_att.address,
//    value: ethers.utils.parseEther("12.0"), // Sends exactly 1.0 ether
//      });
    //await pool_att.setEFTaddress(eft.address);
    await eft.mint(pool_att.address,2222222);
    console.log("eftt balance:",await eft.balanceOf(pool_att.address));
    return { pool_att ,eft};
  }

    it("Try and buy", async function () {
  // ...deploy the contract as before...
     const [owner,add1,add2] = await ethers.getSigners();
     const {pool_att , eft} = await loadFixture(CreatePool);
     await pool_att.connect(add1).buy({value : ethers.utils.parseEther("1.0")});
     console.log("bought eftt amount",await eft.balanceOf(add1.address));

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
     console.log("time: ",timestampBefore);
     console.log("block number", blockNumBefore);
//    await pool_att.setTimeLock(1000);
//
//     await expect(pool_att.connect(add1).buy({value : ethers.utils.parseEther("1.0")})).to.be.revertedWith("ICO is over :( ");
         });

 it("Test ending of ICO", async function () {
  // ...deploy the contract as before...
     const [owner,add1,add2] = await ethers.getSigners();
     const {pool_att , eft} = await loadFixture(CreatePool);
    await pool_att.connect(add1).buy({value : ethers.utils.parseEther("3.0")});
     console.log("bought eftt amount",await eft.balanceOf(add1.address));
     await expect(pool_att.setTimeLock(1000));
//     const blockNumBefore = await ethers.provider.getBlockNumber();
//    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
//    const timestampBefore = blockBefore.timestamp;
//     await helpers.time.increaseTo(timestampBefore+100);
    await time.increase(3600);
   await expect(pool_att.connect(owner).endICO());


     //console.log()
        });

 it("Create LP pool", async function () {
  // ...deploy the contract as before...
     const [owner,add1,add2] = await ethers.getSigners();
     const {pool_att , eft} = await loadFixture(CreatePool);
       await pool_att.createPool();

        });

it("mint, buy, create LP pool and add funds to it", async function () {
    const [owner,add1,add2] = await ethers.getSigners();
     const {pool_att , eft} = await loadFixture(CreatePool);
     await expect(pool_att.setTimeLock(18000000000));
        console.log("time lock currently", await pool_att.timeLock());
        await pool_att.connect(add2).buy({value : ethers.utils.parseEther("2.0")});

     console.log("bought eftt amount",await eft.balanceOf(add2.address));
       // await pool_att.connect(owner).createPool();


        await pool_att.connect(owner).addLPwithWETH({value: ethers.utils.parseEther("1.0")});
        await pool_att.getPoolStats();
     });

it("withdraw LP", async function () {
    const [owner,add1,add2] = await ethers.getSigners();
     const {pool_att , eft} = await loadFixture(CreatePool);
     await expect(pool_att.setTimeLock(18000000000));

        await pool_att.getPoolStats();
     });

//
//    describe("Check pool funding", function(){
//        it("check on pool supply", async function () {
//  // ...deploy the contract as before...
//        const {pool_att } = await loadFixture(CreatePool);
//        await expect(pool_att.getPoolStats());
//        });
//    });

//    describe("Check buy", function(){
//        it("check on buy", async function () {
//  // ...deploy the contract as before...
//        const {pool_att } = await loadFixture(CreatePool);
//        const [owner,add1,add2,add3] = await ethers.getSigners();
//        await pool_att.connect(add1).buyFunc(1000 ,{value : ethers.utils.parseEther("1.0")});
//
//        await pool_att.connect(add2).buyFunc(1000 ,{value : ethers.utils.parseEther("12.0")});
//
//        await pool_att.connect(add3).buyFunc(1000 ,{value : ethers.utils.parseEther("13.0")});
//        });
//    });



//    describe("Events", function () {
//      it("Should emit an event on checking pool", async function () {
//        const {pool_att ,IUniswapV2Factory_address} = await loadFixture(CreatePool);
//    await expect(pool_att.getPoolStats(IUniswapV2Factory_address)).to.emit(pool_att, "balances"); // We accept any value as `when` arg
//      });
//    });
//    describe("buy try", function () {
//      it("Should emit an event on checking pool", async function () {
//        const {pool_att ,IUniswapV2Factory_address} = await loadFixture(CreatePool);
//        const [owner, add1, add2,add3] = await ethers.getSigners();
//
//        timer =await (pool_att.getBocktime());
//        //dt=new Date(timer * 1000).toLocaleString();
//        console.log(timer);
//        await network.provider.send("evm_setNextBlockTimestamp", [1676181772])
//         await expect(pool_att.connect(add1).buySome({ value: 1 })).to.be.revertedWith(
//        "not time!"
//      );
//        await network.provider.send("evm_setNextBlockTimestamp", [1676181769+18840])
//        await network.provider.send("evm_mine");
//
//        dt=new Date(timer * 1000).toLocaleString();
//        console.log(dt);
//        await expect(pool_att.connect(add1).buySome({ value: 0 })).to.be.revertedWith(
//        "need more eth!"
//      );
//        await expect(pool_att.connect(add1).buySome({ value: 1 }));
//
//      });
//    });
});
