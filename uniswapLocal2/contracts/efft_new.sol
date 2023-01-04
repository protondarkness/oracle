// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@nettswap/INetswapRouter.sol";
import "@nettswap/NetswapFactory.sol";

contract EFTT is ERC20, AccessControl {
    using SafeMath for uint256;
    //below are the testnet addresses!!!!!
    address constant NettswapFactory_address=  0xA327674305d490199B76b186Ed360fCad3296949;
    address constant NettswapRouter_address = 0x19BCFEe83ee0D77158b0c151150aFb0f389E4721;
    address constant Metis_address = 0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000;
    address payable immutable dev_address;
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
    uint8 constant liquidityRatio = 2;
    uint256 constant liquidityLock = 180000000;
    uint256 public constant maxICO = 2500000 * (10 ** decimals);
    uint256 private burnRatio;
    uint256 public SoldInMetis;
    uint256 public SoldEFTT;
    uint256 constant earlyAllot = 950000 * 10** decimal;
    uint256 constant remainingPercentage = 43;
    uint8 constant burnPeriodOne =10;
    uint8 constant burnPeriodTwo = 14;
    uint8 constant stakePeriod = 14;
    uint256 initialLiquidityTokens;
    address LP_Pair;
    bool private BURNED = false;
    bool public VOTE_ACTIVE = false;
    uint256 public Vote_length;
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
        Periods[1].MaxBurn = 1000000 * 10** decimal;
        Periods[1].timeValid = 1000;
        Periods[2].Active = false;
        Periods[2].MaxBurn = 1400000 * 10** decimal;
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

    modifier _lpLock(){
        require(block.timestamp > liquidityLock,"must wait to remove lp");
        _;
    }

    modifier _vote(){
        require(VOTE_ACTIVE, "Voting is not active");
        require(Vote_length < block.timestamp, "time to vote is over");
        _;
    }

//emit functions
    event Log(string);
    event Sold(uint256,address);
    event Burned(uint256);
    event LPcreated(uint256,uint256);
    event Balances(uint256,uint256);

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

    function invDevSocialWithdraw(uint256 _amnt) public onlyRole(DEV_INVESTOR_ROLE){
        require(_amnt < balanceOf(address(this)),"not enough to withdraw");
        transfer(msg.sender,_amnt);
    }

    receive() external payable {
        emit Log("receive hit");
        buy();
    }
    fallback() external payable{
        emit Log("fallback hit");
        buy();
    }

    function buy() public payable _timeCheck _noReentry returns(bool){
        require(msg.value > 0," please send metis");
        uint256 buyAmount = msg.value.mul(ratioMetis);
        console.log("buy amount %o", buyAmount);
        require(buyAmount + SoldEFTT <= maxICO, "exceeds the total for sale during ICO");
        uint256 devcut = msg.value.div(2);
        (bool sent, bytes memory data) = devaddress.call{value: devcut}("");
        require(sent, "Failed to send Ether");
        mint(msg.sender,buyAmount);
        SoldEFTT += buyAmount;
        SoldInMetis += msg.value;
        emit Sold(buyAmount,msg.sender);
        return true;
    }

    function endICO() public onlyRole(BURNER_ROLE) _endICO _lpCreated _burnCheck{
         burnRatio = maxICO.div(soldEFFT);
         uint256 burnAmnt = maxICO - soldEFFt;
         //burning unsold and what would be used for Liquidity Pool
         internalBurn(burnAmnt.mul(3).div(2));
         //mint(address(this),burnAmnt.mul(3).div(2));
         //burn(address(this),burnAmnt.mul(3).div(2));

         //createPool
         createPool();
         //add Liquidity
         addLiquidity();
         console.log("burned amount",burnAmnt);
    }

    function addLiquidity() private payable onlyRole(BURNER_ROLE){
        //keep 1 metis in contract for gas fees
        uint256 metisLiquidity = address(this).balance;
        uint256 efttLiquidity = conversion(metisLiquidity);
        console.log("eftt , ", efttLiquidity);
        approve(NettswapRouter_address, efttLiquidity);
        (,,initialLiquidityTokens) = INetswapRouter(NettswapRouter_address).addLiquidityMetis{value: metisLiquidity}(
             address(this),
             efttLiquidity,
             0,
             0,
             address(this),
             block.timestamp + 360
         );
        emit LPcreated(efttLiquidity,msg.value);
    }

    function transferLiquidity() public _lpLock onlyRole(DEFAULT_ADMIN_ROLE){
        IERC20(LP_Pair).approve(msg.sender,IERC20(LP_Pair).balanceOf(address(this)));
        IERC20(LP_Pair).transferFrom(address(this),msg.sender,IERC20(LP_Pair).balanceOf(address(this)));

    }
    //make private
    function createPool() private onlyRole(BURNER_ROLE) returns(address){
        LP_Pair = pairFor(NettswapFactory_address,address(this) ,WETH);
         if (INetswapFactory(NettswapFactory_address).getPair(address(this) ,Metis_address) == address(0)) {
             INetswapFactory(NettswapFactory_address).createPair(address(this) ,Metis_address);
         }
        console.log("factory address",LP_Pair);
        return LP_Pair;
    }

    function burnPeriod(uint256 _amnt) public onlyRole(BURNER_ROLE) returns(bool){
        if(Periods[1].timeValid > block.timestamp && Periods[2].Active == false){
            Periods[1].Active = false;
            Periods[2].Active = true;
        }else if(Periods[2].timeValid > block.timestamp && Periods[2].Active == true){
            Periods[2].Active=false;
        }

        if(Periods[2].Active){
            uint256 toBurn = Periods[2].MaxBurn.div(burnRatio);
            require(_amnt +Periods[2].Burnt < Periods[2].MaxBurn,"trying to burn too much");
            internalBurn(_amnt);
            Periods[2].Burnt += _amnt;
            return(true);
        }
        if(Periods[1].Active){
            require(_amnt +Periods[1].Burnt < Periods[1].MaxBurn,"trying to burn too much");
            internalBurn(_amnt);
            Periods[1].Burnt += _amnt;
            return(true);
        }
        return(false);
    }


    function internalBurn(uint256 _amnt)private onlyRole(BURNER_ROLE) returns(bool){
        mint(address(this),_amnt);
        burn(address(this),_amnt);
        emit Burned(_amnt);
        return true;
    }
    function getPercentage(uint256 _a,uint256 _b) private pure returns(uint256){
        return(_a.mul(_b).div(100));
    }

    function setUpVote(bool _allowVote, uint256 _time)public onlyRole(DEFAULT_ADMIN_ROLE){
        VOTE_ACTIVE = _allowVote;
        Vote_length = _time;
    }

    function vote() public _vote {

    }

}