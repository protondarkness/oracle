// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract TestAuction{

    struct Bid{
        bool highest;
        uint amount;
        address bidder;
    }
    string public auction;
    Bid[] public bids;
    mapping(address => uint) balances;
    bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor (string memory name){
        auction =name;
    }

    function recieveBid() payable public returns(string memory){
        Bid memory bido;
        bido.highest = true;
        bido.amount = msg.value;
        bido.bidder = msg.sender;

        bids.push(bido);
        balances[msg.sender] = msg.value;
        return('recieveBid');
    }

    function withdrawBid() noReentrant payable public returns(bool){
        
        uint amt = balances[msg.sender];
        (bool sent, ) = msg.sender.call{value: amt}("");
        require(sent, "Failed to send Ether");
        balances[msg.sender] -= amt;
        return sent;

    }

    function getBalance(address _addy) public view returns(uint){
        return balances[_addy];
    }

}
