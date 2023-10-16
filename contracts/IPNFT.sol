// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.20;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./utils/Counters.sol";

contract IPNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _index;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name , _symbol)
        Ownable(address(this))
    {}

    function mint(address to, string memory uri) public onlyOwner returns(uint256) {
        require(to != address(0), "Mint error: destination address can't be zero.");
        uint256 tokenId = _index.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _index.increment();
        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function getTokenURI(uint256 tokenId) public view returns(string memory) {
        return tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}