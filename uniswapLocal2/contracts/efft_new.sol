// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "netswap/INetswapRouter.sol";
import "netswap/INetswapFactory.sol";
//todo: delete below
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "hardhat/console.sol";

contract EFTT is ERC20, AccessControl {
    using SafeMath for uint256;
    //below are the testnet addresses!!!!!
//    address constant NettswapFactory_address=  0xA327674305d490199B76b186Ed360fCad3296949;
//    address constant NettswapRouter_address = 0x19BCFEe83ee0D77158b0c151150aFb0f389E4721;
    address immutable NettswapFactory_address;
    address immutable NettswapRouter_address;
    address constant Metis_address = 0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000;
    address payable immutable dev_address;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant BURN_ROLE = keccak256("BURN_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant DEV_INVESTOR_ROLE = keccak256("DEV_INVESTOR_ROLE");

    uint256 public constant decimal = 18;
    uint256 public constant decimal_ending = 10**18;
    uint256 public constant maxSupply = 10000000 * decimal_ending;
    uint256 public totalMinted;
    bool internal locked;
    uint256 public immutable timeDeployed;
    //todo: maybe delete below timelock
    uint256 public immutable timeLock;
    uint256 public immutable liquidityLock;

    uint256 constant unix_month = 2419200;
    uint256 constant unix_six_month = 2419200 *6;
    uint256 constant ratioMetis = 128;
    uint8 constant liquidityRatio = 2;
    ////todo: change this

    uint256 public constant maxICO = 2500000 * (10 ** decimal);
    ////todo: change this
    uint256 private burnRatio=1;
    uint256 public SoldInMetis;
    uint256 public SoldEFTT;
//todo cleanup below
//    uint256 constant remainingPercentage = 43;
//    uint8 constant burnPeriodOne =10;
//    uint8 constant burnPeriodTwo = 14;
//    uint8 constant stakePeriod = 14;
    uint256 public initialLiquidityTokens;
    address public LP_address;
    bool private BURNED = false;

    bool public VOTE_ACTIVE = false;
    uint256 public Vote_length;
    uint256 public voteFor;
    uint256 public voteAgainst;

    struct Vote_ballot {
        bool hasVoted;
        uint256 weight;
        bool inFavorOf;
    }
    mapping(address=>Vote_ballot) Snapshot;

    struct period{
        uint256 MaxAmount;
        uint256 CurrentAmount;
        bool Active;
        uint256 timeValid;
        bool burn_Ratio;
    }
    mapping(uint256=>period) BurnPeriods;
    mapping(uint256=>period) WithdrawPeriods;

    constructor(address _n1, address _n2) ERC20("ElonFreedomTwitterToken", "EFTT") {
        //todo:need to do more role creation in here
        NettswapFactory_address= _n1;
        NettswapRouter_address = _n2;
        //timelock creation
        timeDeployed = block.timestamp;
        timeLock = timeDeployed + unix_month;
        liquidityLock = timeDeployed + unix_month + unix_six_month;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
//        mint(address(this),earlyAllot);
        //todo keep eye on above
        dev_address = payable(msg.sender);
        establishMintPeriods();
        establishBurnPeriods();
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
    modifier _lpLock(){
        require(block.timestamp > liquidityLock,"must wait to remove lp");
        _;
    }
    modifier _vote(){
        require(VOTE_ACTIVE, "Voting is not active");
        if(Vote_length > block.timestamp){
            VOTE_ACTIVE = false;
        }
        require(Vote_length < block.timestamp, "time to vote is over");
        _;
    }

//emit functions
    event LOG(string);
    event SOLD(uint256,address);
    event BURNEDSUPPLY(uint256);
    event LPCREATED(uint256,uint256);
    event BALANCES(uint256,uint256);
    event VOTED(address,bool,uint256);
    event MINTED(uint256);
/////////////////////

//contract functions
    function grantRolesArray(bytes32[] calldata _roles, address[] calldata _assignees) public onlyRole(DEFAULT_ADMIN_ROLE){
        for(uint i=0; i < _roles.length;i++){
            grantRole(_roles[i],_assignees[i]);
        }
    }

    ////todo: look at this closer the times and such
    function establishMintPeriods() private {
        WithdrawPeriods[0].Active=true;
        WithdrawPeriods[0].MaxAmount = 950000 * decimal_ending;
        WithdrawPeriods[0].timeValid = timeDeployed + unix_month;
        WithdrawPeriods[0].burn_Ratio = false;
        for(uint i=1;i<6;i++){
            WithdrawPeriods[i].Active = false;
            WithdrawPeriods[i].MaxAmount = 300000 * decimal_ending;
            WithdrawPeriods[i].timeValid = timeDeployed + unix_month + unix_six_month.mul(i);
            WithdrawPeriods[i].burn_Ratio = true;
        }
    }
    ////todo: look at this closer the times and such
    function establishBurnPeriods() private {
        BurnPeriods[0].Active=true;
        BurnPeriods[0].MaxAmount = 1000000 * decimal_ending;
        BurnPeriods[0].timeValid = timeDeployed + unix_month;
        BurnPeriods[1].Active = false;
        BurnPeriods[1].MaxAmount = 1400000 * decimal_ending;
        BurnPeriods[1].timeValid = timeDeployed + unix_six_month;
    }

    function mint(address _to, uint256 _amnt) public onlyRole(MINTER_ROLE) {
        require(totalMinted + _amnt  <= maxSupply, "tried to mint more than total supply");
        _mint(_to, _amnt);
        totalMinted += _amnt;
        emit MINTED(_amnt);
    }

    function burn(address _address, uint256 _amnt) public onlyRole(BURN_ROLE){
        _burn(_address, _amnt);
    }

    function invDevSocialWithdraw(uint256 _amnt) public onlyRole(DEV_INVESTOR_ROLE){
        for(uint i =0; i<6;i++){
            if(WithdrawPeriods[i].Active){
                if(WithdrawPeriods[i].timeValid > block.timestamp){
                    if(WithdrawPeriods[i].burn_Ratio){
                        WithdrawPeriods[i].MaxAmount = WithdrawPeriods[i].MaxAmount.div(burnRatio);
                        WithdrawPeriods[i].burn_Ratio = false;
                    }
                    require(_amnt + WithdrawPeriods[i].CurrentAmount <= WithdrawPeriods[i].MaxAmount,"trying to withdraw too much");
                    _mint(msg.sender, _amnt);
                    WithdrawPeriods[i].CurrentAmount += _amnt;
                    console.log("withdraw period",i);
                    break;
                }else{
                    WithdrawPeriods[i].Active = false;
                    if(i+1<6){
                        WithdrawPeriods[i+1].Active = true;
                    }
                }
            }
        }
    }

    receive() external payable {
        emit LOG("receive hit");
        buy();
    }
    fallback() external payable{
        emit LOG("fallback hit");
        buy();
    }

    function buy() public payable _timeCheck _noReentry returns(bool){
        require(msg.value > 0," please send metis");
        uint256 buyAmount = msg.value.mul(ratioMetis);
        console.log("buy amount %o", buyAmount);
        require(buyAmount + SoldEFTT <= maxICO, "exceeds the total for sale during ICO");
        uint256 devcut = msg.value.div(2);
        console.log("to dev amount %o", devcut);
        (bool sent, bytes memory data) = dev_address.call{value: devcut}("");
        require(sent, "Failed to send Ether");
        _mint(msg.sender,buyAmount);
        SoldEFTT += buyAmount;
        SoldInMetis += msg.value;
        emit SOLD(buyAmount,msg.sender);
        return true;
    }

    function endICO() public onlyRole(BURN_ROLE) _endICO _burnCheck{
         burnRatio = maxICO.div(SoldEFTT);
         uint256 burnAmnt = maxICO - SoldEFTT;
         //burning unsold and what would be used for Liquidity Pool
        if(burnAmnt > 0){
            internalBurn(burnAmnt.mul(3).div(2));
        }

         //createPool
         createPool();
         //add Liquidity
         addLiquidity();
         console.log("burned amount",burnAmnt);
    }

    //todo: delete below only here because of metis and disfunctioning
      function addLiquidityTest() internal onlyRole(BURN_ROLE){
        uint256 metisLiquidity = address(this).balance;
        uint256 efttLiquidity = metisLiquidity.mul(ratioMetis);
        mint(address(this),efttLiquidity);
        console.log("eftt , ", efttLiquidity);
        _approve(address(this), NettswapRouter_address, efttLiquidity);
        (,,initialLiquidityTokens) = INetswapRouter(NettswapRouter_address).addLiquidityETH{value: metisLiquidity}(
             address(this),
             efttLiquidity,
             0,
             0,
             address(this),
             block.timestamp + 360
         );

        console.log("lp amnts:", IERC20(LP_address).balanceOf(address(this)));
        console.log("lp token here amnts:", initialLiquidityTokens);
        emit LPCREATED(efttLiquidity,msg.value);
    }
//todo changeEthTOMEtis in function to add liquidity
    function addLiquidity() internal onlyRole(BURN_ROLE){
        uint256 metisLiquidity = address(this).balance;
        uint256 efttLiquidity = metisLiquidity.mul(ratioMetis);
        mint(address(this),efttLiquidity);
        console.log("eftt , ", efttLiquidity);
        _approve(address(this), NettswapRouter_address, efttLiquidity);
        (,,initialLiquidityTokens) = INetswapRouter(NettswapRouter_address).addLiquidityETH{value: metisLiquidity}(
             address(this),
             efttLiquidity,
             0,
             0,
             address(this),
             block.timestamp + 360
         );

        console.log("lp amnts:", IERC20(LP_address).balanceOf(address(this)));
        console.log("lp token here amnts:", initialLiquidityTokens);
        emit LPCREATED(efttLiquidity,msg.value);
    }
//todo: delete
    function getReserves() public{
         (uint reserve0, uint reserve1,) = IUniswapV2Pair(LP_address).getReserves();
        console.log("balance1 %o balance2 %o", reserve0,reserve1);

    }
//todo:delete
    function transferLiquidity() public _lpLock onlyRole(DEFAULT_ADMIN_ROLE){
        console.log("lp b4 tx",IERC20(address(LP_address)).balanceOf(address(this)));
        console.log(IERC20(LP_address).totalSupply());
        IERC20(LP_address).approve(msg.sender,IERC20(LP_address).balanceOf(address(this)));
        IERC20(LP_address).transferFrom(address(this),msg.sender,IERC20(LP_address).balanceOf(address(this)));

    }
    //todo: erase this
    function getLPBal(address _add)public{
        uint256 dd=IERC20(LP_address).balanceOf(_add);
        console.log(LP_address);
        console.log(dd);
    }

    function createPool() private onlyRole(BURN_ROLE) returns(address){
        //LP_address = INetswapFactory(NettswapFactory_address).pairFor(address(this) ,Metis_address);
         if (INetswapFactory(NettswapFactory_address).getPair(address(this) ,Metis_address) == address(0)) {
             LP_address = INetswapFactory(NettswapFactory_address).createPair(address(this) ,Metis_address);
         }
        console.log("factory address",LP_address);
        return LP_address;
    }

    function burnPeriodV2(uint256 _amnt) public onlyRole(BURN_ROLE){
        for(uint i =0; i<2 ;i++){
            if(BurnPeriods[i].Active){
                if(BurnPeriods[i].timeValid > block.timestamp){
                    if(BurnPeriods[i].burn_Ratio){
                        BurnPeriods[i].MaxAmount = BurnPeriods[i].MaxAmount.div(burnRatio);
                        BurnPeriods[i].burn_Ratio = false;
                    }
                    require(_amnt + BurnPeriods[i].CurrentAmount <= BurnPeriods[i].MaxAmount,"trying to burn too much");
                    internalBurn(_amnt);
                    BurnPeriods[i].CurrentAmount += _amnt;
                    break;
                }else{
                    WithdrawPeriods[i].Active = false;
                    if(i+1<2){
                        WithdrawPeriods[i+1].Active = true;
                    }
                }
            }
        }

    }


    function internalBurn(uint256 _amnt)private onlyRole(BURN_ROLE) returns(bool){
        mint(address(this),_amnt);
        burn(address(this),_amnt);
        emit BURNEDSUPPLY(_amnt);
        return true;
    }

    function getPercentage(uint256 _a,uint256 _b) private pure returns(uint256){
        return(_a.mul(_b).div(100));
    }

    function setUpVote(bool _allowVote, uint256 _time, address[] calldata  _snapshot_addresses, uint256[] calldata _snapshot_balances)public onlyRole(DEFAULT_ADMIN_ROLE){
        VOTE_ACTIVE = _allowVote;
        Vote_length = _time;
        for(uint256 i = 0 ; i < _snapshot_balances.length ; i++) {
            Snapshot[_snapshot_addresses[i]].weight = _snapshot_balances[i];
        }
    }

    function vote(bool _forOrAgainst) public _vote {
        require(!Snapshot[msg.sender].hasVoted,"you already voted once");
        require(balanceOf(msg.sender)>0,"you must own token to vote");
        Snapshot[msg.sender].weight = balanceOf(msg.sender);
        Snapshot[msg.sender].inFavorOf = _forOrAgainst;
        Snapshot[msg.sender].hasVoted = true;
        if(_forOrAgainst == true){
            voteFor +=balanceOf(msg.sender);
        }else{
            voteAgainst +=balanceOf(msg.sender);
        }
        emit VOTED(msg.sender,_forOrAgainst,balanceOf(msg.sender));
    }

    function checkVoteResults() public returns(bool){
        //todo: uncomment below to time restrict, also
        //todo: need to restrict access to some sort of validator while also
        //todo: allowing burn_role
        //require(Vote_length > block.timestamp, "time to vote is still going on");
        VOTE_ACTIVE = false;
        console.log("vote for %o, vote against %o",voteFor,voteAgainst);
        if(voteFor > voteAgainst){
            uint256 totalToBurn = totalSupply() - totalMinted;
            internalBurn(totalToBurn);
        }
        return true;
    }


}