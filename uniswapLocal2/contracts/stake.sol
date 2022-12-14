// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Iefft.sol";
import "@uniswap/v2-core/contracts/test/ERC20.sol";


contract stake is ERC20{
    IEFTT immutable eftt;
    mapping (address => uint256) public balanceStaked;

    constructor(address _eftt) ERC20("ElonFreedomTwitterToken_stakeToken", "xEFTT"){
        eftt = IEFTT(_eftt);
    }

    function stake(uint256 _amnt) public {
        require(eftt.allowance(msg.sender, address(this))>=_amnt, "must allow more for trade");
        eftt.transferFrom(msg.sender,address(this),_amnt);
        balanceOf[msg.sender]+=_amnt;
        _mint(msg.sender,_amnt);
    }
    function unstake(uint256 _amntStake) public{
        approve(address (this),_amntStake);
        _burn(msg.sender,_amntStake);
        balanceOf[msg.sender] -= _amntStake;
        eftt.transfer(msg.sender, _amntStake);
    }

}