// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract EFTT_old is ERC20, Ownable, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant BURN_ROLE = keccak256("BURN_ROLE");
    bytes32 public constant BURN_ADMIN = keccak256("BURN_ADMIN");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant decimal = 18;
    uint256 public constant maxSupply = 10000000 * 10** decimal;
    address public act1 =0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

    uint256 public totalMinted;
    bool internal locked;

    modifier _noReentry() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor() ERC20("ElonFreedomTwitterToken", "EFTT") {
        _grantRole(DEFAULT_ADMIN_ROLE,msg.sender);
        _grantRole(BURN_ROLE, act1);
    }


    function mint(address _to, uint256 _amnt) public onlyRole(DEFAULT_ADMIN_ROLE) {

        require(totalSupply() + _amnt <= maxSupply, "tried to mint more than total supply");
        _mint(_to, _amnt* 10**decimal);
    }

    function addRole(address _address)public onlyRole(DEFAULT_ADMIN_ROLE){
         _grantRole(VALIDATOR_ROLE,_address);
    }


}