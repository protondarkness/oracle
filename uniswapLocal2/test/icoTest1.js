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
    const EFT = await hre.ethers.getContractFactory("EFTT_old");
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
    const decs = 10^18;
     await expect(pool_att.setTimeLock(18000000000));
         await pool_att.connect(add2).buy({value : ethers.utils.parseEther("10.0")});
     console.log("bought eftt amount",(await eft.balanceOf(add2.address))/decs);
       await pool_att.connect(owner).createPool();


        await pool_att.connect(owner).addLPwithWETH({value: ethers.utils.parseEther("10.0")});

        await pool_att.getPoolStats();
        var bal = await pool_att.getTokenPrice();
        console.log("getting price",(bal))
        //await pool_att.removeLP();
        await pool_att.connect(owner).swap({value: ethers.utils.parseEther("1.0")})
        await pool_att.getPoolStats();
        await pool_att.getReserves('0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc');
     });

it("test allowance", async function(){


    });
});
