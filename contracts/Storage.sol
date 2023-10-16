// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.20;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./thirdparty/ERC4907.sol";
import "./thirdparty/ERC6551Registry.sol";
import "./utils/Governance.sol";
import "./IPNFT.sol";
import "./Union.sol";
import "./utils/Random.sol";

contract Storage {
    Governance internal governance;

    IPNFT internal ipnft;
    
    ERC6551Registry internal ipAccountRegistry;

    ERC4907 internal erc4907Factory;

    Union internal unionContract;

    Random internal randomGenerator;
}