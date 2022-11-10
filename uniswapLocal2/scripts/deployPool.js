// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {


  const Pool_Att = await hre.ethers.getContractFactory("CreatePoolAttempt");
  const  IUniswapV2Factory_address = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // uniswap v2 factory on ethereum mainnet
    const IUniswapV2Router02_address ='0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const pool_att = await Pool_Att.deploy(IUniswapV2Router02_address, IUniswapV2Factory_address);

  await pool_att.deployed();
console.log(
    `our pool deployed to ${pool_att.address}`
  );
  console.log(
    `Crating pool`
  );
  const [owner, add1, add2,add3] = await ethers.getSigners();

    const transactionHash = await owner.sendTransaction({
    to: pool_att.address,
    value: ethers.utils.parseEther("12.0"), // Sends exactly 1.0 ether
});
  await (pool_att.poolCreate());
   timer =await (pool_att.getBocktime());
  dt=new Date(timer * 1000).toLocaleString();
    console.log(dt);
    await network.provider.send("evm_setNextBlockTimestamp", [parseInt(timer)+18800])
await network.provider.send("evm_mine");
 timer =await (pool_att.getBocktime());
  dt=new Date(timer * 1000).toLocaleString();
    console.log(dt);

    await pool_att.connect(add1).buySome({ value: 1 });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
