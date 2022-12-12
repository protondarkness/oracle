const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const  hre = require("hardhat");
const {
  time,
  loadFixture,mine,
} = require("@nomicfoundation/hardhat-network-helpers");

describe("Create ICO", function () {
  async function CreatePool() {
    //const  IUniswapV2Factory_address = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // uniswap v2 factory on ethereum mainnet
    //const IUniswapV2Router02_address ='0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    const EFT = await hre.ethers.getContractFactory("EFTT");
    const eft = await EFT.deploy();
    const Pool_att = await hre.ethers.getContractFactory("efftICO");

    const [owner,add1,add2] = await ethers.getSigners();
    console.log("Token owner:", owner.address);
    const pool_att = await Pool_att.deploy(eft.address,owner.address);

//    const transactionHash = await owner.sendTransaction({
//    to: pool_att.address,
//    value: ethers.utils.parseEther("12.0"), // Sends exactly 1.0 ether
//      });
    //await pool_att.setEFTaddress(eft.address);
    await eft.mint(pool_att.address,2222222);
    console.log("eftt balance:",await eft.balanceOf(pool_att.address));
    await expect(pool_att.setTimeLock(18000000000));
        console.log("time lock currently", await pool_att.timeLock());

    return { pool_att ,eft};
  }




it("withdraw LP", async function () {
    const [owner,add1,add2] = await ethers.getSigners();
     const {pool_att , eft} = await loadFixture(CreatePool);

     await expect(pool_att.setTimeLock(18000000000));
         await pool_att.connect(add2).buy({value : ethers.utils.parseEther("2.0")});
             console.log(await eft.balanceOf(add2.address));
     console.log("bought eftt amount",await eft.balanceOf(add2.address));
       await pool_att.connect(owner).createPool();


        await pool_att.connect(owner).addLPwithWETH({value: ethers.utils.parseEther("1.0")});

        await pool_att.getPoolStats();
        await pool_att.withdrawLPtokens();
     });

it("test allowance", async function(){
     const [owner,add1,add2] = await ethers.getSigners();
     const {pool_att , eft} = await loadFixture(CreatePool);

      await pool_att.connect(add1).buy( {value : ethers.utils.parseEther("1000.0")});
//      await mine(100);
      console.log("add1 ",await eft.balanceOf(add1.address));
      await eft.connect(add1).approve(pool_att.address,1000);
      await mine(100);
//      const allower = await eft._allowances;
//      for (let [key, value] of allower) {
//console.log(key + " = " + value);
//}
//     await network.provider.send("evm_increaseTime", [3600]);
//await network.provider.send("evm_mine");
      await pool_att.connect(add2).spendie(add1.address);
//      await network.provider.send("evm_increaseTime", [3600]);
//await network.provider.send("evm_mine");
          await mine(100);
      console.log("add1 ",await eft.balanceOf(add1.address));
      console.log("add2 ",await eft.balanceOf(add2.address));
    });
});
