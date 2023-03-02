// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "./ERC20.sol";

contract TestToken is ERC20 {
    constructor() ERC20("Token", "TKN") {
        _mint(msg.sender, 1000000000 * 10 ** 18);
    }
}
