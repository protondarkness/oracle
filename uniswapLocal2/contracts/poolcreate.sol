
pragma solidity ^0.5.0 || ^0.6.0 || ^0.7.0 || ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@uniswap/v2-core/contracts/test/ERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
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

contract CreatePoolAttempt is ERC20{

    address payable immutable owner;
    IUniswapV2Factory immutable uniswapV2Factory;
    IUniswapV2Router02 immutable uniswapV2Router;
    address immutable public  WETH;
    address immutable IUniswapV2Factory_address = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; // uniswap v2 factory on ethereum mainnet
    address immutable IUniswapV2Router02_address =0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;// uniswap v2 router on ethereum mainnet

    modifier ownerOnly() { require(msg.sender == owner, "Owner only"); _; }

    constructor(IUniswapV2Router02 _uniswapV2Router,
                IUniswapV2Factory _uniswapV2Factory
                    )ERC20("Testor", "TrT")
    {
        require (address(_uniswapV2Factory) != address(0));
        require (address(_uniswapV2Router) != address(0));
        owner = payable(msg.sender);

        uniswapV2Factory = _uniswapV2Factory;
        uniswapV2Router = _uniswapV2Router;

        address weth = _uniswapV2Router.WETH();
        WETH = weth;
    }

    function poolCreate()public ownerOnly {
        uint256 wethBalance = IERC20(WETH).balanceOf(address(this));

        uint256 totalLiquidityEth = 10;
        uint256 totalLiquidityUpp = 900; // pump price by 10% when uniswap is funded
     uint256 initialLiquidityTokens;
    uint256 minLiquidityCrisisTime;

        _mint(address(this), 1000); // liquidity (~20%) for uniswap + 10
        _approve(address(this), address(uniswapV2Router), totalLiquidityUpp);
        //staking.increaseRewardsPot();
        //escrow.start();
        if (wethBalance < totalLiquidityEth) {
            IWETH(WETH).deposit{ value: totalLiquidityEth - wethBalance }();
        }
        IERC20(WETH).approve(address(uniswapV2Router), totalLiquidityEth);
        (,,initialLiquidityTokens) = uniswapV2Router.addLiquidity(
            address(this),
            WETH,
            totalLiquidityUpp,
            totalLiquidityEth,
            totalLiquidityUpp,
            totalLiquidityEth,
            address(this),
            block.timestamp);

        //minLiquidityCrisisTime = block.timestamp + 60 * 60 * 24 * 30; // Creating a liquidity crisis isn't available for the first month

        //emit Sale(false);
    }

    receive()external payable {
//        uint256 tokens = tokensPerEth * msg.value;
//        uint256 sold = soldEth;
//        require (address(groupManager) == address(0) && tokens > 0 && sold < maxSoldEth, "Tokens are not for sale or you did not send any ETH/WETH");
//        _mint(msg.sender, tokens);
//        soldEth = sold + msg.value;
    }

    }

