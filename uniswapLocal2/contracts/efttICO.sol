// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Iefft.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
//import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";

import "hardhat/console.sol";

contract efftICO is AccessControl{
    using SafeMath for uint256;
    bytes32 public constant INVESTOR_ROLE = keccak256("INVESTOR_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant EXTEND_ICO_ROLE = keccak256("EXTEND_ICO_ROLE");
    address immutable IUniswapV2Factory_address = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; // uniswap v2 factory on ethereum mainnet
    address immutable IUniswapV2Router02_address =0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;// uniswap v2 router on ethereum mainnet
    IUniswapV2Factory  uniswapV2Factory;
    IUniswapV2Router02  uniswapV2Router;
    address payable owner;
    address constant METISADDRESS = 0x9E32b13ce7f2E80A01932B42553652E053D6ed8e;
    address constant BurnAddress =  address(0xdeaDDeADDEaDdeaDdEAddEADDEAdDeadDEADDEaD);
    uint public constant decimals = 18;
    uint256 public timeLock=18000000000;
    IEFTT eftt;
    uint256 public constant maxICO = 2500000 * (10 ** decimals);
    uint256 SoldInMetis;
    uint256 public SoldEFTT;
    uint256 ratioMetis = 128;
    mapping(uint => uint) timeLocks;
    bool private BURNED = false;
    uint constant liquidityRatio = 2;
    bool internal locked;
    uint256 month =2592000;
    uint256 week = 604800;
    uint256 immutable creationtTime;
    uint256 ICOtimeLock;
    address LP_Pair;

    constructor(address _eftt, address _dev) payable {
        //below might have to obfuscate with for loop
        _grantRole(INVESTOR_ROLE, _dev);
        _grantRole(BURNER_ROLE, _dev);
        _grantRole(EXTEND_ICO_ROLE, _dev);
        owner = payable(msg.sender);
        eftt = IEFTT(_eftt);

        creationtTime = block.timestamp;
        timeLocks[0] = 111;
        timeLocks[1] = 222;
        timeLocks[2] = 333;
            }


    event Log(string func);
    event Sold(uint);
    event Burned(uint);
    event LPcreated(uint256,uint256);
    event balances(uint256,uint256);

//modifiers
    modifier _timeCheck(){
        require(block.timestamp < timeLock,"ICO is over :( ");
        _;
    }


    modifier _endICO(){
        require(block.timestamp > timeLock,"ICO is still ongoing :( ");
        _;
    }

    modifier _burnCheck(){
        require(!BURNED,"the supply is already burned");
        _;
        BURNED = true;
    }
    modifier _onlyOwner(){
        require(owner == msg.sender,"You're not the owner");
        _;
    }
    modifier _lpCreated(){
        require(LP_Pair!=address(0),"create liquidity pool first");
        _;
    }
    modifier _noReentry() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

//end modifiers
    ////////////////////////////
    function setTimeLock(uint256 _t) public {
        timeLock = _t;
    }

    ///////////////////////
    receive() external payable {
        //add in if just metis sent to contract
        emit Log("fallback hit");
        buy();
    }


    function buy() public payable _timeCheck _noReentry returns(bool){
        require(msg.value > 0," please send metis");
        uint256 buyAmount = conversion(msg.value);
        console.log("buy amount %o", buyAmount.div(10**18));
        require(buyAmount + SoldEFTT <= maxICO, "exceeds the total for sale");
        eftt.transfer(msg.sender, buyAmount);
        SoldEFTT += buyAmount;
        SoldInMetis += msg.value;
        emit Sold(buyAmount);
        return true;
    }

    function withdraw(uint256 _amnt) onlyRole(INVESTOR_ROLE) public {

        if ( creationtTime + month * 18 > block.timestamp){
            uint256 convertedAmnt =percentFromICO(_amnt);
            eftt.approve( address(this), convertedAmnt);
            payable(msg.sender).transfer(convertedAmnt);
        } else if ( creationtTime + month * 12 > block.timestamp){
            uint256 convertedAmnt =percentFromICO(_amnt);
            payable(msg.sender).transfer(convertedAmnt);
        } else if ( creationtTime + month * 6 > block.timestamp){
            uint256 convertedAmnt =percentFromICO(_amnt);
            payable(msg.sender).transfer(convertedAmnt);
        }

    }

    function endICO() public onlyRole(BURNER_ROLE) _endICO _lpCreated _burnCheck{
        uint256 burnAmnt = eftt.balanceOf(address(this));
        eftt.transfer(BurnAddress,burnAmnt);
        emit Burned(burnAmnt);
        console.log("burned amount",burnAmnt);
    }


    function addLiquidity() external payable onlyRole(BURNER_ROLE){
        uint256 metisLiquidity = SoldInMetis.div(liquidityRatio);
        uint256 efttLiquidity = conversion(metisLiquidity);
        console.log("eftt , ", efttLiquidity);
        //IERC20(METISADDRESS).approve(address(this),metisLiquidity);
        eftt.approve(IUniswapV2Router02_address, efttLiquidity);

          (,,uint initialLiquidityTokens) = IUniswapV2Router02(IUniswapV2Router02_address).addLiquidityETH(
             address(eftt),
             efttLiquidity,
             0,
             0,
             address(this),
             block.timestamp + 360
         );
        emit LPcreated(efttLiquidity,msg.value);
    }

    function addLPwithWETH() public payable {
        address WETH = IUniswapV2Router02(IUniswapV2Router02_address).WETH();
        console.log("weth:",WETH);
        uint256 metisLiquidity = SoldInMetis.div(liquidityRatio);
        uint256 efttLiquidity = metisLiquidity.mul(ratioMetis);
        console.log("liq1 %o, liq2 %o", metisLiquidity, efttLiquidity);
        IWETH(WETH).deposit{value: metisLiquidity}();
        uint256 wethBalance = IERC20(WETH).balanceOf(address(this));
        //IERC20(WETH).approve(address(this),wethBalance);

        //eftt.allowance(address(this), IUniswapV2Router02_address);
        eftt.approve(IUniswapV2Router02_address, efttLiquidity);
        uint256 sp = eftt.allowance( address(this), IUniswapV2Router02_address);
        console.log("allowed to spend", sp);
        IERC20(WETH).approve(IUniswapV2Router02_address, wethBalance);
        console.log("eftt ,weth ", efttLiquidity , wethBalance );
         (,,uint initialLiquidityTokens) = IUniswapV2Router02(IUniswapV2Router02_address).addLiquidity(
            address(eftt),
            WETH ,
            efttLiquidity ,
            wethBalance ,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(this),
            block.timestamp + 360
        );
    console.log("lp amnts:", IERC20(LP_Pair).balanceOf(address(this)));
        console.log("lp token here amnts:", initialLiquidityTokens);

    }
    function swap() payable public{
        address WETH = IUniswapV2Router02(IUniswapV2Router02_address).WETH();
        address[] memory path = new address[](2);
        path[1] = address(eftt);
        path[0] = WETH;
        IWETH(WETH).deposit{value: msg.value}();
        uint256 amountIn= IERC20(WETH).balanceOf(address(this));
        uint256 amountOut = amountIn*ratioMetis;
        IERC20(WETH).approve(IUniswapV2Router02_address, amountIn);
        console.log("amountIn %o  amountOut %o", amountIn, amountOut);
        uint256[] memory amounts = IUniswapV2Router02(IUniswapV2Router02_address).getAmountsOut(amountIn, path);
         //console.log("amounts %o",amounts);
        for(uint8 j =0;j < amounts.length; j+=1){
            console.log("amounts %o",amounts[j]);
        }
        IUniswapV2Router02(IUniswapV2Router02_address).swapTokensForExactTokens(amountIn, amountOut, path, msg.sender, block.timestamp);
        console.log("eftt balancer %o", eftt.balanceOf(msg.sender));

    }

    function getReserves(address pair) public{
        address factPair = address(pair);
        (uint reserve0, uint reserve1,) = IUniswapV2Pair(pair).getReserves();
        console.log("balance1 %o balance2 %o", reserve0,reserve1);
        console.log("blocktime %o",block.timestamp );
        emit balances(reserve0, reserve1);
    }
    function createPool() public onlyRole(BURNER_ROLE) returns(address){
        address WETH = IUniswapV2Router02(IUniswapV2Router02_address).WETH();
        LP_Pair = pairFor(IUniswapV2Factory_address,address(eftt) ,WETH);
         if (IUniswapV2Factory(IUniswapV2Factory_address).getPair(address(eftt) ,WETH) == address(0)) {
             IUniswapV2Factory(IUniswapV2Factory_address).createPair(address(eftt) ,WETH);
         }
        console.log("factory address",LP_Pair);
        return LP_Pair;
    }

    function getPoolStats() public returns(uint,uint) {
        address tokenA = address(eftt);
        address factory = IUniswapV2Factory_address;
        address tokenB = IUniswapV2Router02(IUniswapV2Router02_address).WETH();
        console.log("factory address %o my aaddree %o", factory, address(this));
        LP_Pair = createPool();
         (uint reserve0, uint reserve1,) = IUniswapV2Pair(LP_Pair).getReserves();
        console.log("balance1 %o balance2 %o", reserve0,reserve1);
        console.log("lp token amount %o",IERC20(LP_Pair).balanceOf(address(this)));
        //(uint reserveA, uint reserveB) = UniswapV2Library.getReserves(factory, WETH, address(this));
        emit balances(reserve0, reserve1);
        return (reserve0, reserve1);
    }

    function removeLP() public{
        console.log("lp token amount %o",IERC20(LP_Pair).balanceOf(address(this)));
        address WETH = IUniswapV2Router02(IUniswapV2Router02_address).WETH();
        IERC20(LP_Pair).approve(IUniswapV2Router02_address,IERC20(LP_Pair).balanceOf(address(this)));
        (uint amountA, uint amountB) = IUniswapV2Router02(IUniswapV2Router02_address).removeLiquidity(
            address(eftt),
            WETH ,
            IERC20(LP_Pair).balanceOf(address(this)),
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(this),
            block.timestamp
        );
         (uint reserve0, uint reserve1,) = IUniswapV2Pair(LP_Pair).getReserves();
        console.log("balance1 %o balance2 %o", reserve0,reserve1);
        console.log("lp token amount %o",IERC20(LP_Pair).balanceOf(address(this)));
        emit balances(amountA, amountB);
        console.log("balance1 internal %o balance2 internal %o", amountA,amountB);
    }
//may not need to include the functions below
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, 'UniswapV2Library: IDENTICAL_ADDRESSES');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2Library: ZERO_ADDRESS');
    }

    function pairFor(address factory, address tokenA, address tokenB) internal pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(uint160(uint256(keccak256(abi.encodePacked(
                hex'ff',
                factory,
                keccak256(abi.encodePacked(token0, token1)),
                hex'96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f' // init code hash
            )))));
    }
    function getTokenPrice() public view returns(uint){
        IUniswapV2Pair pair = IUniswapV2Pair(LP_Pair);
        (uint Res0, uint Res1,) = pair.getReserves();
        uint res0 = Res0*(10**18);
        console.log("res1 %o res2 %o",Res0,Res1);
        return(Res1.div(Res0)); //
   }

    function conversion(uint256 _amnt) private view returns(uint256){
        return(_amnt.mul(ratioMetis));
    }

    function percentFromICO(uint256 _amnt) private returns(uint256){
        return _amnt.mul(soldPercent());
    }

    function soldPercent() public view returns(uint256){
        return SoldEFTT.div(maxICO);
    }

}