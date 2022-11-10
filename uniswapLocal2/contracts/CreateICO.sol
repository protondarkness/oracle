
//pragma solidity >=0.4.22 <0.8.0;
pragma solidity ^0.5.0 || ^0.6.0 || ^0.7.0 || ^0.8.0;
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
//import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
//import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@uniswap/v2-core/contracts/test/ERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "hardhat/console.sol";
//import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
//import "../../weth/WETH10-main/contracts/interfaces/IERC20.sol";
//import "../../weth/WETH10-main/contracts/interfaces/IERC20.sol";

interface IUniswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}

contract CreateICO {

    address payable immutable owner;
    IUniswapV2Factory immutable uniswapV2Factory;
    IUniswapV2Router02 immutable uniswapV2Router;
    address immutable public  WETH;
    address immutable IUniswapV2Factory_address = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; // uniswap v2 factory on ethereum mainnet
    address immutable IUniswapV2Router02_address =0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;// uniswap v2 router on ethereum mainnet
    IUniswapV2Pair public uniswapEthUppPair;
    IERC20 EFT;
    address eft;
    modifier ownerOnly() { require(msg.sender == owner, "Owner only"); _; }

    event balances(uint reserve0, uint reserve1);

    constructor(IUniswapV2Router02 _uniswapV2Router,
                IUniswapV2Factory _uniswapV2Factory
                    )
    {
        require (address(_uniswapV2Factory) != address(0));
        require (address(_uniswapV2Router) != address(0));
        owner = payable(msg.sender);
        //MyToken = IERC20(address(this));
        uniswapV2Factory = _uniswapV2Factory;
        uniswapV2Router = _uniswapV2Router;

        address weth = _uniswapV2Router.WETH();
        WETH = weth;
    }

    function setEFTaddress(address _address) public {
        eft = _address;
    }
    event Received(address, uint);
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function getBocktime() public view returns(uint256){
        uint256 timer = block.timestamp;
        console.log("time %o",timer);
        return(timer);
    }

    function poolCreate()public payable ownerOnly {
        uint256 wethBalance = IERC20(WETH).balanceOf(address(this));
        console.log("weth address %o and balance %o", WETH, wethBalance);
        //uint256 totalLiquidityEth = 10;
        uint256 _balance =  address(this).balance;
        IWETH(WETH).deposit{value: 10 ether}();
        wethBalance = IERC20(WETH).balanceOf(address(this));
        console.log("weth address %o and balance %o", WETH, wethBalance);
        address tokenA = eft;
        address tokenB = WETH;
        uint256 amountADesired = 1000000;
        uint256 amountBDesired = 10;
        uint8 amountAMin =0;
        uint8 amountBMin = 0;

        IERC20(WETH).approve(address(this),wethBalance);
        IERC20(eft).approve(address(this), amountADesired);
        console.log("weth address %o and balance %o", WETH, wethBalance);
        uint bal =  IERC20(eft).balanceOf(address(this));
        console.log("ballance %o",bal);
        address paris = checkPoolCreated(IUniswapV2Factory_address,tokenA,tokenB);
        console.log("new token balancer %o", paris);

        IERC20(WETH).approve(IUniswapV2Router02_address, 10);

         (,,uint initialLiquidityTokens) = IUniswapV2Router02(IUniswapV2Router02_address).addLiquidity(
            address(this),
            WETH,
            amountADesired,
            10,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(this),
            block.timestamp + 360
        );


        (uint reserve0, uint reserve1,) = IUniswapV2Pair(paris).getReserves();
        console.log("balance1 %o balance2 %o", reserve0,reserve1);

    }

    event buy(uint256 a,address aa);
    modifier timeLock(){
        console.log("time %o",getBocktime());
        require(getBocktime()> 1676181769, "time is not resady");
        _;
    }
    function buySome() public payable timeLock{
        require(msg.value > 0,"need more eth!");
        uint256 tokens = msg.value * 1000;
        //_mint(address(this),tokens);
       //_approve(address(this), msg.sender, tokens);
        //_transfer(address(this), msg.sender,tokens);
        //console.log("addy %o, amount %o", msg.sender, MyToken.balanceOf(msg.sender));
        emit buy(tokens, msg.sender);
    }
//
    function checkPoolCreated(address factory,address tokenA,address tokenB) internal returns(address){
        address paris = pairFor(factory, tokenB,tokenA);
        console.log("paired address %o ", paris);
        if (IUniswapV2Factory(factory).getPair(tokenA, tokenB) == address(0)) {
            IUniswapV2Factory(factory).createPair(tokenA, tokenB);
        }
        return paris;
    }

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

    function getPoolStats(address factory) public returns(uint,uint) {
        address tokenA = address(eft);
        address tokenB = WETH;
        console.log("factory address %o my aaddree %o", factory, address(this));
        address paris = checkPoolCreated(factory, tokenA, tokenB);
         (uint reserve0, uint reserve1,) = IUniswapV2Pair(paris).getReserves();
        console.log("balance1 %o balance2 %o", reserve0,reserve1);
        //(uint reserveA, uint reserveB) = UniswapV2Library.getReserves(factory, WETH, address(this));
        emit balances(reserve0, reserve1);
        return (reserve0, reserve1);
    }



    }

