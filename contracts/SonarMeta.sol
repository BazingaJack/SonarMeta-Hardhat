// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.20;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Context.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./thirdparty/ERC4907.sol";
import "./Storage.sol";
import "./IPNFT.sol";
import "./utils/ReentrancyGuard.sol";
import "./utils/Random.sol";
import "./utils/Counters.sol";
import "./Union.sol";

contract SonarMeta is Ownable, Storage, ReentrancyGuard, Random {

    using Counters for Counters.Counter;
    Counters.Counter private _accountIndex;
    Counters.Counter private _ERC4907TokenIndex;

    uint256 constant monthToSeconds = 30 * 24 * 60 * 60;
    uint256 immutable maxUnion;
    uint256 immutable incubatePeriod;
    uint256 immutable settlementPeriod;
    uint256 immutable settlementInterval;
    address private ipnftImpAddr;
    address private erc6551AccountImpAddr;
    address private unionImpAddr;
    address payable sonarMetaAccount;

    struct BorrowInfo {
        uint256 tokenId;
        address user;
        uint256 expires;
        uint256 tokenType;
    }

    mapping (uint256 => address) public erc6551Acccounts;
    mapping (address => mapping(uint256 => BorrowInfo)) accountInfo;

    constructor(
        address _ipNFTAddr,
        address _erc6551AccountImplAddr,
        address _ipAccountRegistryAddr,
        address _erc4907ImplAddr,
        address _unionImpAddr,
        address _initialOwner)Ownable(_initialOwner){
            initializeReentrancyGuard();
            governance = Governance(_initialOwner);
            ipnft = IPNFT(_ipNFTAddr);
            ipAccountRegistry = ERC6551Registry(_ipAccountRegistryAddr);
            erc6551AccountImpAddr = _erc6551AccountImplAddr;
            erc4907Factory = ERC4907(_erc4907ImplAddr);
            unionContract = Union(_unionImpAddr);
            ipnftImpAddr = _ipNFTAddr;
            maxUnion = 50;
            incubatePeriod = 6 * monthToSeconds;
            settlementPeriod = 12 * monthToSeconds;
            settlementInterval = monthToSeconds;
    }

    

    function createIPFromExistNFT(address _tokenContract,address _ipOwnerAddr,uint256 _chainId,uint256 _tokenId)
    public nonReentrant onlyOwner returns(address){
        governance.requireGovernor(msg.sender);
        require(_ipOwnerAddr != address(0), "Mint error: destination address can't be zero.");
        address ipAccountAddr =  ipAccountRegistry.createAccount(
            erc6551AccountImpAddr,
            _chainId,
            _tokenContract,
            _tokenId,
            getRandom(100000),
            "");
        return ipAccountAddr;
    }

    function createNewIP(string memory _uri,address _ipOwnerAddr, uint256 _chainId)
    public nonReentrant onlyOwner returns(address){
        //mint ERC721 token 
        governance.requireGovernor(msg.sender);
        require(_ipOwnerAddr != address(0), "Mint error: destination address can't be zero.");
        uint256 ipNFTTokenId = ipnft.mint(_ipOwnerAddr, _uri);
        //mint ERC6551 account
        address ipAccountAddr =  ipAccountRegistry.createAccount(
            erc6551AccountImpAddr,
            _chainId,
            ipnftImpAddr,
            ipNFTTokenId,
            getRandom(100000),
            "");
        uint256 accountId = _accountIndex.current();
        erc6551Acccounts[accountId] = ipAccountAddr;
        _accountIndex.increment();
        return ipAccountAddr;
    }

    function recreate(string memory _newIPURI, address _ip6551AccountAddr, uint256 _chainId)
    public nonReentrant onlyOwner returns (address){
        //根据已有NFT进行二创
        //mint ERC6551 account
        return createNewIP(_newIPURI, _ip6551AccountAddr, _chainId);
    }

    function mint4907Token(address _accountAddr,uint256 _tokenType) public nonReentrant onlyOwner{
        uint256 tokenId = _ERC4907TokenIndex.current();
        erc4907Factory.mint(_accountAddr, tokenId);
        BorrowInfo memory borrowInfo = BorrowInfo(tokenId,address(0),block.timestamp,_tokenType);
        accountInfo[_accountAddr][tokenId] = borrowInfo;
    }
    
    function grantToUnion(address _accountAddr,address _unionAddr,uint256 _tokenId,uint256 _expires)
    public nonReentrant onlyOwner{
        require(unionContract.checkMemberNum(), "Grant Error: Member num hasn't reach the min.");
        BorrowInfo storage borrowInfo = accountInfo[_accountAddr][_tokenId];
        borrowInfo.expires = _expires;
        borrowInfo.user = _unionAddr;
    }

    function dividendToUnion(uint256 _amount,address _accountAddr,uint256 _tokenId) public payable nonReentrant onlyOwner{
        address user = accountInfo[_accountAddr][_tokenId].user;
        uint256 expires = accountInfo[_accountAddr][_tokenId].expires;
        uint256 tokenType = accountInfo[_accountAddr][_tokenId].tokenType;
        require(user != address(0),"Dividend Error: This token hasn't be borrowed yet.");
        require(expires >= block.timestamp,"Dividend Error: It's already exceed the dividend period.");
        require(tokenType == 1,"Dividend Error: Token type error.");
        address[] memory unionMember;
        uint256[] memory unionMemberWeight;
        uint256 totalWeight;
        (unionMember,unionMemberWeight,totalWeight) = unionContract.getMemberInfo();
        for(uint256 i = 0;i < unionMember.length;i++){
            uint256 transferAmount = _amount * unionMemberWeight[i] / totalWeight;
            address payable memberAddress = payable(unionMember[i]);
            _amount -= transferAmount;
            memberAddress.transfer(transferAmount);
        }
        if(_amount > 0){
            sonarMetaAccount.transfer(_amount);
        }
    }
}