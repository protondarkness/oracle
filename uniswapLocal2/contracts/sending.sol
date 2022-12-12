// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Iefft.sol";


contract socialTransactor{

    IEFTT immutable eftt;
    mapping(address => bytes32) addressToHandle;
    mapping(bytes32 => address) handleToAddress;
    mapping(address => uint256) addressBalance;
    mapping(bytes32 => uint256) handleBalance;
    mapping(address => mapping(bytes32 => uint256)) txAddrToHandle;
    mapping(bytes32 => mapping(bytes32 => uint256)) txHandleToHAndle;
    struct user{
        bytes32 _handle;
        bool _verified;
    }
    mapping(address => user) socialEngage;

    constructor(address _eftt){
        eftt = IEFTT(_eftt);

    }

    function register(bytes32 _hndl) public{
        socialEngage[msg.sender]._handle = _hndl;

    }

    function sender(address _from, address _to, uint256 _amnt) public {
        require(socialEngage[_from]._verified,"please verify account");
        require(eftt.allowance(_from, address(this))<=_amnt, "must allow more for trade");
        if(!socialEngage[_to]._verified){
            eftt.transferFrom(_from, address(this), _amnt);

        }
        if

    }


}