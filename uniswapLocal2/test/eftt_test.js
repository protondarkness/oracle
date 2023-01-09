const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const  hre = require("hardhat");
const { keccak256 } = require("@ethersproject/keccak256");
const { toUtf8Bytes } = require("@ethersproject/strings");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
require("@nomicfoundation/hardhat-chai-matchers");

const roles = ["BURN_ROLE",
       "MINTER_ROLE",
       "DEV_INVESTOR_ROLE"];
const mint = keccak256(toUtf8Bytes(roles[1]));
const burn = keccak256(toUtf8Bytes(roles[0]));
const inv = keccak256(toUtf8Bytes(roles[2]));
const admin = '0x0000000000000000000000000000000000000000000000000000000000000000';

describe("Contract Deployment ICO", function () {
  async function DeployFixture() {
    //const  NETSWAP_factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // uniswap v2 factory on ethereum mainnet
    //const IUniswapV2Router02_address ='0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
     const  IUniswapV2Factory_address = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // uniswap v2 factory on ethereum mainnet
    const IUniswapV2Router02_address ='0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
      const EFT = await hre.ethers.getContractFactory("EFTT");
    const [owner,addr1,addr2,addr3,addr4,addr5] = await ethers.getSigners();
    const ico_deployed = await EFT.deploy(IUniswapV2Factory_address,IUniswapV2Router02_address);
    console.log("Token owner:", owner.address);
    const adrs = [owner,addr1,addr2,addr3,addr4,addr5];

    return { ico_deployed ,adrs};
  }
  //mint
  //burn
  //invDevSocialWithdraw
  //
  //buy
  //recieve
  //fallback
  //endico
    //addliquidity
    //transferliquidity
    //createpool
    //burnperiod
    //vote stuff
  describe("ICO period", function (){
    it("Check set Roles", async function () {
  // ...deploy the contract as before...
       const {ico_deployed,adrs } = await loadFixture(DeployFixture);

     console.log("role keccakHash is: ",roles[1]);

        console.log("mint ",mint);
      await (ico_deployed.connect(adrs[0]).grantRole(mint, adrs[1].address));
       await (ico_deployed.connect(adrs[0]).grantRole(burn, adrs[2].address));
       const rolemsg = await (ico_deployed.hasRole(admin,adrs[0].address));
       console.log("role....", rolemsg);
       console.log("balance of contract....", await ico_deployed.balanceOf(ico_deployed.address));
       await expect(ico_deployed.connect(adrs[0]).mint(adrs[1].address,(1000))).to.emit(ico_deployed, "MINTED").withArgs(1000);
       //await expect(ico_deployed.connect(adrs[1]).mint(adrs[1].address,(1000))).to.emit(ico_deployed, "MINTED").withArgs(1000);
       await expect(ico_deployed.connect(adrs[2]).mint(adrs[1].address,(1000))).to.be.revertedWith(/AccessControl: account .* is missing role .*/);
       const ownerBalance = await ico_deployed.connect(adrs[1]).balanceOf(adrs[1].address);
       console.log("balance of ",ownerBalance);
       for (let i = 0; i < adrs.length; i++) {
            await ico_deployed.connect(adrs[0]).grantRole(inv,adrs[i].address);
            let has_role = await (ico_deployed.hasRole(inv,adrs[0].address));
            console.log("role....", has_role);
            console.log("role...", inv);
       }//end for
         });//it end

        });//describe("ICO period") end


    it("Check Buy from ICO", async function () {
        const {ico_deployed,adrs } = await loadFixture(DeployFixture);
        console.log("balance eth", ethers.utils.formatEther(await ethers.provider.getBalance(adrs[0].address)));
        await (ico_deployed.connect(adrs[1]).buy({value : ethers.utils.parseEther("1.0")}));
        console.log("balance", ethers.utils.formatEther(await ico_deployed.balanceOf(adrs[1].address)));
        console.log("balance dev", await ico_deployed.balanceOf(adrs[0].address));
        console.log("balance eth", ethers.utils.formatEther(await ethers.provider.getBalance(adrs[0].address)));
        console.log("SOld trtacked in contract EFTT", ethers.utils.formatEther(await ico_deployed.SoldEFTT()));
    });//end it

 it("End ICO", async function () {
        const {ico_deployed,adrs } = await loadFixture(DeployFixture);
        await (ico_deployed.connect(adrs[0]).grantRole(burn, adrs[0].address));
        let blockNumBefore = await ethers.provider.getBlockNumber();
        let blockBefore = await ethers.provider.getBlock(blockNumBefore);
        let timestampBefore = blockBefore.timestamp;
        console.log("block eth", blockNumBefore);
        console.log("time eth", timestampBefore);
        //code b4 timeforward
        await expect(ico_deployed.connect(adrs[0]).endICO()).to.be.revertedWith("ICO is still ongoing :( ");
        console.log("balance contract EFTT", await ico_deployed.balanceOf(ico_deployed.address));
        console.log("SOld trtacked in contract EFTT", ethers.utils.formatEther(await ico_deployed.SoldEFTT()));
        console.log("Total minted in contract EFTT", ethers.utils.formatEther(await ico_deployed.totalMinted()));
        await (ico_deployed.connect(adrs[1]).buy({value : ethers.utils.parseEther(".10")}));
        //--------------
        const timeForward = 18000000001;
        await ethers.provider.send("evm_mine", [timeForward]);
        blockNumBefore = await ethers.provider.getBlockNumber();
        blockBefore = await ethers.provider.getBlock(blockNumBefore);
        timestampBefore = blockBefore.timestamp;
        console.log("block eth", timestampBefore);
        //code after timeforward
        await expect(ico_deployed.connect(adrs[0]).buy()).to.be.revertedWith("ICO is over :( ");
        await (ico_deployed.connect(adrs[0]).endICO());
        console.log("balance contract EFTT", await ico_deployed.balanceOf(ico_deployed.address));
        console.log("SOld trtacked in contract EFTT", ethers.utils.formatEther(await ico_deployed.SoldEFTT()));
        console.log("Total minted in contract EFTT", ethers.utils.formatEther(await ico_deployed.totalMinted()));

    });//end it

    it("Test withdraw", function (){
    const unix_month = 2419200;
     const {ico_deployed,adrs } = await loadFixture(DeployFixture);
     await (ico_deployed.connect(adrs[0]).grantRole(inv, adrs[0].address));
     await ico_deployed.invDevSocialWithdraw(950000);
     let bal = await ico_deployed.balanceOf(adrs[0].address);
     console.log('balance ',bal;

    });//end it withdraw
//  describe("Pool Create", function (){
//    it("Create pool and init supply", async function () {
//  // ...deploy the contract as before...
//       const {pool_att } = await loadFixture(CreatePool);
//      await expect(pool_att.poolCreate());
//         });
//        });
//
//    describe("Check pool funding", function(){
//        it("check on pool supply", async function () {
//  // ...deploy the contract as before...
//        const {pool_att } = await loadFixture(CreatePool);
//        await expect(pool_att.getPoolStats());
//        });
//    });
//
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
