// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Iefft.sol";
import "./verify.sol";

contract socialTransactor is Verify{

    IEFTT immutable eftt;
    mapping(address => bytes32) addressToHandle;
    mapping(bytes32 => address) handleToAddress;
    mapping(address => uint256) addressBalance;
    mapping(bytes32 => uint256) handleBalance;
    mapping(address => mapping(bytes32 => uint256)) txAddrToHandle;
    mapping(bytes32 => mapping(bytes32 => uint256)) txHandleToHAndle;
    struct user{
        address _address;
        bool _verified;
        uint256 _balance;
    }
    mapping(bytes32 => user) socialEngage;

    constructor(address _eftt){
        eftt = IEFTT(_eftt);

    }

    function register(bytes32 _hndl) public{
        socialEngage[msg.sender]._handle = _hndl;

    }

    function sender(bytes32 _from, bytes32 _to, uint256 _amnt) public {
        require(socialEngage[_from]._verified,"please verify account");
        require(eftt.allowance(_from, address(this))>=_amnt, "must allow more for trade");
        if(!socialEngage[_to]._verified){
            eftt.transferFrom(socialEngage[_from]._address, address(this), _amnt);
            socialEngage[_to]._balance = _amnt;
        }else{
            eftt.transferFrom(socialEngage[_from]._address, socialEngage[_to]._address, _amnt);
        }

    }

    function claim(bytes32 _hndl) public{
        require(socialEngage[_hndl]._verified,"not verified");

    }

}