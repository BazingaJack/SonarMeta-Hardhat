// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.20;

contract Random {

    //TODO replace with VDF
    function getRandom(uint256 maxNum) internal view returns (uint256) {
        return uint(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender
        ))) % maxNum;
    }
}