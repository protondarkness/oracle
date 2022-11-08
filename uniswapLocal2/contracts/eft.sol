// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract EFT is ERC20, ERC20Burnable {
    constructor() ERC20("ElonFreedomTwitterToken", "EFT") {}

    function mint(address to, uint256 amount) public  {
        _mint(to, amount);
    }


}
