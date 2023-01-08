// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Iefft.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract stakeMechs is ERC20,ERC20Burnable{
    IEFTT immutable eftt;
    mapping (address => uint256) public balanceStaked;

    constructor(address _eftt) ERC20("ElonFreedomTwitterToken_stakeToken", "xEFTT"){
        eftt = IEFTT(_eftt);
    }

    function stake(uint256 _amnt) public {
        require(eftt.allowance(msg.sender, address(this))>=_amnt, "must allow more for trade");
        eftt.transferFrom(msg.sender,address(this),_amnt);
        balanceStaked[msg.sender]+=_amnt;
        _mint(msg.sender,_amnt);
    }
    function unstake(uint256 _amntStake) public{
        approve(address(this),_amntStake);
        _burn(msg.sender,_amntStake);
        balanceStaked[msg.sender] -= _amntStake;
        eftt.transfer(msg.sender, _amntStake);
    }

}