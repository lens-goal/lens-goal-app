// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Contract {
    uint256 num;

      constructor(){}

    function setNum(uint256 _num) external {
        num = _num;
    }

    function getNum() external view returns(uint256){
        return num;
    }
    }