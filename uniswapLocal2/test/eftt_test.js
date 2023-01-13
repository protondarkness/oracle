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
const IERC20ABI = require('../test/IERC20.json');
const ERC20ABI = require('../scripts/erc20.abi.json');
const roles = ["BURN_ROLE",
       "MINTER_ROLE",
       "DEV_INVESTOR_ROLE","LIQUIDITY_ROLE"];
const mint = keccak256(toUtf8Bytes(roles[1]));
const burn = keccak256(toUtf8Bytes(roles[0]));
const inv = keccak256(toUtf8Bytes(roles[2]));
const liq = keccak256(toUtf8Bytes(roles[3]));
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

    it("Test withdraw periods", async function (){
    const unix_month = 2419200;
     const {ico_deployed,adrs } = await loadFixture(DeployFixture);
     await (ico_deployed.connect(adrs[0]).grantRole(inv, adrs[0].address));
    //6 periods, firts is 950k
    //after is 300k
    let blockNumBefore = await ethers.provider.getBlockNumber();
        let blockBefore = await ethers.provider.getBlock(blockNumBefore);
        let timestampBefore = blockBefore.timestamp;
        console.log("block eth", blockNumBefore);
        console.log("time eth", timestampBefore);
        let wda = 100000*10**18;
        let wdb = 50000*10**18;

        let bal=0;
        let periods = [0,1,7,13,19,25,26];
        let wds = [wda*9 +wdb ,3*wda,3*wda,3*wda,3*wda,wda*3];
        const timeDeployed = (await ico_deployed.timeDEPLOYED()).toNumber();
        console.log("deployed ",timeDeployed);
        let timeForward = timeDeployed;
        for(let i=0;i<6;i++){
          for(let j = 0; j<3; j++){
                if(j == 0){
                    await ico_deployed.invDevSocialWithdraw(wds[i].toLocaleString('fullwide', {useGrouping:false}));
                    console.log("period ",i);
                     console.log("section ",j);
                }
                if(j == 1){
                    await expect(ico_deployed.invDevSocialWithdraw(wds[i].toLocaleString('fullwide', {useGrouping:false}))).to.be.revertedWith("trying to withdraw too much");
                    console.log("period ",i);
                     console.log("section ",j);
                }
                if(j==2){
                    timeForward = timeDeployed + periods[i+1]*unix_month;
                    console.log(timeForward);
                    await ethers.provider.send("evm_mine", [timeForward]);
                    console.log("period ",i);
                     console.log("section ",j);
                     bal = await ico_deployed.balanceOf(adrs[0].address);
                console.log('balance ',ethers.utils.formatEther(bal));
                }

          }
          }



    });//end it withdraw

     it("Test Burn periods", async function (){
    const unix_month = 2419200;
     const {ico_deployed,adrs } = await loadFixture(DeployFixture);
     await (ico_deployed.connect(adrs[0]).grantRole(burn, adrs[0].address));
    //6 periods, firts is 950k
    //after is 300k
    let blockNumBefore = await ethers.provider.getBlockNumber();
        let blockBefore = await ethers.provider.getBlock(blockNumBefore);
        let timestampBefore = blockBefore.timestamp;
        console.log("block eth", blockNumBefore);
        console.log("time eth", timestampBefore);
        let wda = 1000000*10**18;
        let wdb = 400000*10**18;

        let bal=0;
        let periods = [0,1,7,8];
        let wds = [wda,wda + wdb,wdb];
        const timeDeployed = (await ico_deployed.timeDEPLOYED()).toNumber();
        console.log("deployed ",timeDeployed);
        let timeForward = timeDeployed;
        for(let i=0;i<3;i++){
          for(let j = 0; j<3; j++){
                if(j == 0){
                    await ico_deployed.burnPeriod(wds[i].toLocaleString('fullwide', {useGrouping:false}));
                    console.log("period ",i);
                     console.log("section ",j);
                }
                if(j == 1){
                    if(i<2){
                    await expect(ico_deployed.burnPeriod(wds[i].toLocaleString('fullwide', {useGrouping:false}))).to.be.revertedWith("trying to burn too much");
                    }
                    console.log("period ",i);
                     console.log("section ",j);
                }
                if(j==2){
                    timeForward = timeDeployed + periods[i+1]*unix_month;
                    console.log(timeForward);
                    await ethers.provider.send("evm_mine", [timeForward]);
                    console.log("period ",i);
                     console.log("section ",j);
                     bal = await ico_deployed.totalBurned();
                console.log('bURNED!!! ',ethers.utils.formatEther(bal));
                }

          }
          }



    });//end it withdraw


    it("Test vote", async function () {
        const {ico_deployed,adrs } = await loadFixture(DeployFixture);
        await (ico_deployed.connect(adrs[0]).grantRole(mint, adrs[0].address));
        const accounts = await hre.ethers.getSigners();
        let acts = [];
        let bal = [];
        for(i of accounts){
        console.log(i.address);
        await ico_deployed.connect(adrs[0]).mint(i.address,100);
        acts.push(i.address);
        bal.push(100);
        }
        console.log(bal);
        await ico_deployed.connect(adrs[0]).setUpVote(true,100,acts,bal);
        for(i of accounts){
        await ico_deployed.connect(i).vote(true);
        }
        await ico_deployed.connect(i).checkVoteResults();
       });//endtest vote

    it("Check whole buy", async function () {
        const {ico_deployed,adrs,eft } = await loadFixture(DeployFixture);
        const signs= await ethers.getSigners();
        let rs = [mint, inv, burn];
        let adds = [adrs[0].address,adrs[0].address,adrs[0].address];
        console.log(rs);

        await ico_deployed.connect(adrs[0]).grantRolesArray(rs,adds);

        let totalBuy = [1000];
        let buyers = 18;
        let buyInMetis = "9";
        for(i of totalBuy){
            for(let y = 1;y<buyers;y++){
                await (ico_deployed.connect(signs[y]).buy({value : ethers.utils.parseEther(buyInMetis)}));
            }
            for(let y = 1;y<buyers;y++){
                console.log("balance", ethers.utils.formatEther(await ico_deployed.balanceOf(signs[y].address)));
            }
//             console.log("balance dev", await ico_deployed.balanceOf(adrs[0].address));
             console.log("Sold tracked in contract EFTT", ethers.utils.formatEther(await ico_deployed.SoldEFTT()));
             console.log("ETH in contract EFTT", ethers.utils.formatEther(await ethers.provider.getBalance(ico_deployed.address)));
            console.log("ETH total to dev", ethers.utils.formatEther(await ethers.provider.getBalance(adrs[0].address)));
            let blockNumBefore = await ethers.provider.getBlockNumber();
            let blockBefore = await ethers.provider.getBlock(blockNumBefore);
            let timestampBefore = blockBefore.timestamp;
            console.log("block eth", blockNumBefore);
            console.log("time eth", timestampBefore);
            const unix_month = 2419200;
             await ethers.provider.send("evm_mine", [timestampBefore + unix_month]);
        //ending ico
            await expect(ico_deployed.connect(adrs[0]).buy({value : ethers.utils.parseEther(buyInMetis)})).to.be.revertedWith("ICO is over :( ");
             await (ico_deployed.connect(adrs[0]).endICO());
             console.log("----------ico ended----------")
            console.log("balance contract EFTT", await ico_deployed.balanceOf(ico_deployed.address));
            console.log("SOld trtacked in contract EFTT", ethers.utils.formatEther(await ico_deployed.SoldEFTT()));
            console.log("MEtis ratio", await ico_deployed.burnRatio());
            console.log("Total minted in contract EFTT", ethers.utils.formatEther(await ico_deployed.totalMinted()));
            console.log("balance LP tokens", ethers.utils.formatEther(await ico_deployed.initialLiquidityTokens()));
            console.log("tyr", await ico_deployed.LP_address());
            let lp_pair = await ico_deployed.LP_address();
            const provider = ethers.provider;
            const LP = await ethers.getContractAt( ERC20ABI, lp_pair);
             console.log("toks", ethers.utils.formatEther(await LP.balanceOf(ico_deployed.address)));

            await ethers.provider.send("evm_mine", [timestampBefore + unix_month*8]);
            await (ico_deployed.connect(adrs[0]).grantRole(liq, adrs[0].address));
            await ico_deployed.transferLiquidity();

            console.log("toks 1:", ethers.utils.formatEther(await LP.balanceOf(ico_deployed.address)));
            console.log("toks 2:", ethers.utils.formatEther(await LP.balanceOf(adrs[0].address)));

//            const provider = ethers.provider;
//            const DAI = new ethers.Contract(lp_pair, ERC20ABI, adrs[0]);
//            const DAI = await ethers.getContractFactory(lp_pair, ERC20ABI, provider);
//            let factory = await ethers.getContractFactory('EFTT');
//            let ierc20 = await factory.attach(lp_pair);


            }

//        console.log("balance eth", ethers.utils.formatEther(await ethers.provider.getBalance(adrs[0].address)));
//        await (ico_deployed.connect(adrs[1]).buy({value : ethers.utils.parseEther("1.0")}));
//        console.log("balance", ethers.utils.formatEther(await ico_deployed.balanceOf(adrs[1].address)));
//        console.log("balance dev", await ico_deployed.balanceOf(adrs[0].address));
//        console.log("balance eth", ethers.utils.formatEther(await ethers.provider.getBalance(adrs[0].address)));
//        console.log("SOld trtacked in contract EFTT", ethers.utils.formatEther(await ico_deployed.SoldEFTT()));
    });//end check whole buy function
});
