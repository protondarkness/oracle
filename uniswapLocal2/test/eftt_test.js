const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const  hre = require("hardhat");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

describe("Contract Deployment ICO", function () {
  async function DeployFixture() {
    //const  NETSWAP_factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // uniswap v2 factory on ethereum mainnet
    //const IUniswapV2Router02_address ='0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
      const EFT = await hre.ethers.getContractFactory("EFTT");
    const eft = await EFT.deploy();

    const [owner,addr1,addr2,addr3,addr4,addr5] = await ethers.getSigners();
    console.log("Token owner:", owner[0]);
    const adrs = [owner,addr1,addr2,addr3,addr4,addr5];
//
//
//    const transactionHash = await owner.sendTransaction({
//    to: pool_att.address,
//    value: ethers.utils.parseEther("12.0"), // Sends exactly 1.0 ether
//});
//    await pool_att.setEFTaddress(eft.address);
//    await eft.mint(pool_att.address,2222222);
    return { eft ,adrs};
  }
  describe("ICO period", function (){
    it("Check set Roles", async function () {
  // ...deploy the contract as before...
       const {ico_deployed,adrs } = await loadFixture(DeployFixture);
       const roles = ["BURN_ROLE",
       "MINTER_ROLE",
       "DEV_INVESTOR_ROLE"];
       let hash = ethers.utils.solidityKeccak256(roles[0]);
       console.log("role keccakHash is: ",hash);

      await expect(ico_deployed.connect(adrs[0]).addRole(adrs[1],hash));
         });//it end

        });//describe("ICO period") end



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
