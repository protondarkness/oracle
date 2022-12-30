// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract EFTT is ERC20, AccessControl {
    using SafeMath for uint256;
    //below are the testnet addresses!!!!!
    address constant NetswappFactory=  0xA327674305d490199B76b186Ed360fCad3296949;
    address constant NetswappRouter = 0x19BCFEe83ee0D77158b0c151150aFb0f389E4721;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant BURN_ROLE = keccak256("BURN_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant DEV_INVESTOR_ROLE = keccak256("DEV_INVESTOR_ROLE");

    uint256 public constant decimal = 18;
    uint256 public constant maxSupply = 10000000 * 10** decimal;
    uint256 public totalMinted;
    bool internal locked;
    uint256 constant public timeLock=18000000000;

    uint256 constant ratioMetis = 128;
    uint constant liquidityRatio = 2;
    uint256 public constant maxICO = 2500000 * (10 ** decimals);
    uint256 private burnRatio;
    uint256 public SoldInMetis;
    uint256 public SoldEFTT;
    uint256 constant earlyAllot = 950000 * 10** decimal;
    uint256 constant remainingPercentage = 43;
    uint8 constant burnPeriodOne =10;
    uint8 constant burnPeriodTwo = 14;
    uint8 constant stakePeriod = 14;
    address LP_Pair;
    bool private BURNED = false;
    struct period {
        uint256 MaxBurn;
        uint256 Burnt;
        bool Active;
        uint256 timeValid;
    }
    mapping(uint256=>period) Periods;

    constructor() ERC20("ElonFreedomTwitterToken", "EFTT") {
        //need to do more role creation in here
        _grantRole(DEFAULT_ADMIN_ROLE,msg.sender);
        mint(address(this),earlyAllot);
        Periods[1].Active=true;
        Periods[1].MaxBurn = 10;
        Periods[1].timeValid = 1000;
        Periods[2].Active = false;
        Periods[2].MaxBurn = 14;
        Periods[2].timeValid = 2000;
    }
//modifiers

    modifier _noReentry() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

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

    modifier _lpCreated(){
        require(LP_Pair!=address(0),"create liquidity pool first");
        _;
    }

//emit functions
    event Log(string);
    event Sold(uint256,address);
    event Burned(uint256);
    event LPcreated(uint256,uint256);
    event balances(uint256,uint256);

/////////////////////

//contract functions
    function mint(address _to, uint256 _amnt) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(totalMinted + _amnt  <= maxSupply, "tried to mint more than total supply");
        _mint(_to, _amnt);
        totalMinted += _amnt;
    }

    function burn(uint256 _amnt) public onlyRole(BURN_ROLE){
        _burn(_amnt);
    }

    function addRole(address _address,bytes32 _role)public onlyRole(DEFAULT_ADMIN_ROLE){
         _grantRole(_role,_address);
    }

    function earlyWithdraw(uint256 _amnt) public payable onlyRole(DEV_INVESTOR_ROLE){
        require(_amnt < balanceOf(address(this)),"not enough to withdraw");
        transfer(msg.sender,_amnt);
    }

    receive() external payable {
        emit Log("fallback hit");
        buy();
    }


    function buy() public payable _timeCheck _noReentry returns(bool){
        require(msg.value > 0," please send metis");
        uint256 buyAmount = conversion(msg.value);
        console.log("buy amount %o", buyAmount.div(10**18));
        require(buyAmount + SoldEFTT <= maxICO, "exceeds the total for sale during ICO");
        mint(msg.sender,buyAmount);
        SoldEFTT += buyAmount;
        SoldInMetis += msg.value;
        emit Sold(buyAmount,msg.sender);
        return true;
    }

     function endICO() public onlyRole(BURNER_ROLE) _endICO _lpCreated _burnCheck{
         burnRatio = transform(maxICO,soldEFFT);
         uint256 burnAmnt = maxICO - soldEFFt;
         //burning unsold and what would be used for Liquidity Pool
         mint(address(this),burnAmnt.mul(3).div(2));
         burn(address(this),burnAmnt.mul(3).div(2));
         //createPool
         createPool();
         //add Liquidity
         emit Burned(burnAmnt);
         console.log("burned amount",burnAmnt);
    }

    function addLiquidity() external payable onlyRole(BURNER_ROLE){
        uint256 metisLiquidity = SoldInMetis.div(2);
        uint256 efttLiquidity = conversion(metisLiquidity);
        console.log("eftt , ", efttLiquidity);
        //IERC20(METISADDRESS).approve(address(this),metisLiquidity);
        approve(IUniswapV2Router02_address, efttLiquidity);
        (,,uint initialLiquidityTokens) = IUniswapV2Router02(IUniswapV2Router02_address).addLiquidityETH(
             address(this),
             efttLiquidity,
             0,
             0,
             address(this),
             block.timestamp + 360
         );
        emit LPcreated(efttLiquidity,msg.value);
    }

    //make private
    function addLPwithWETH() public payable onlyRole(BURNER_ROLE){
        address WETH = IUniswapV2Router02(IUniswapV2Router02_address).WETH();
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


    }

    //make private
    function createPool() public onlyRole(BURNER_ROLE) returns(address){
        address WETH = IUniswapV2Router02(IUniswapV2Router02_address).WETH();
        LP_Pair = pairFor(IUniswapV2Factory_address,address(this) ,WETH);
         if (IUniswapV2Factory(IUniswapV2Factory_address).getPair(address(this) ,WETH) == address(0)) {
             IUniswapV2Factory(IUniswapV2Factory_address).createPair(address(this) ,WETH);
         }
        console.log("factory address",LP_Pair);
        return LP_Pair;
    }

    function burnPeriod(uint256 _amnt) public onlyRole(BURNER_ROLE){
        if(Periods[1].timeValid > block.timestamp){
            Periods[1].Active = false;
            Periods[2].Active = true;
        }
        if(Periods[2].Active){
            require(_amnt +Periods[2].Burnt < Periods[2].MaxBurn,"trying to burn too much");
            internalBurn(_amnt);
            Periods[2].Burnt += _amnt;
        }
        if(Periods[1].Active){
            require(_amnt +Periods[1].Burnt < Periods[1].MaxBurn,"trying to burn too much");
            internalBurn(_amnt);
            Periods[1].Burnt += _amnt;

        }

    }



    function conversion(uint256 _amnt) private returns(uint256){
        return(_amnt.mul(ratioMetis));
    }

    function transform(uint256 _a,uint256 _b) private returns(uint256){
        return _a.div(_b);
    }
    function internalBurn(uint256 _amnt)private onlyRole(BURNER_ROLE) returns(bool){
        mint(address(this),_amnt);
        burn(address(this),_amnt);
        BURNED(_amnt);
        return true;
    }
}