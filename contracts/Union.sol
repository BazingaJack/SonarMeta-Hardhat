// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.20;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Union is Ownable{

    uint256 public _nextMemberId;

    uint256 public minMember;
    uint256 public updateInterval;
    uint256 public dividendInterval;
    uint256 public totalWeight;
    uint256 public totalMember;
    
    struct Member {
        uint256 memberId;
        address memberAddress;
        uint256 weight;
        uint256 joinTime;
        bool state;
    }

    mapping (address => uint256) public existed;
    mapping (uint256 => Member) public members;

    event addMemberSuccess(uint256 memberId);
    event addMemberExisted(uint256 memberId);
    event deleteMemberSuccess(uint256 memberId);

    constructor() Ownable(owner()){
        _nextMemberId = 1;
        minMember = 3;
        updateInterval = 30 * 24 * 60 * 60;
        dividendInterval = updateInterval;
        totalWeight = 50;
        totalMember = 0;
    }

    function addMember(address _memberAddr,uint _weight) public onlyOwner() {
        if(existed[_memberAddr] == 0){
            Member memory m = Member(_nextMemberId, _memberAddr, _weight, block.timestamp,true);
            members[_nextMemberId++] = m;
            totalWeight += _weight;
            totalMember++;
            emit addMemberSuccess(m.memberId);
        }else{
            if(members[existed[_memberAddr]].state == false){
                uint256 memberId = existed[_memberAddr];
                members[memberId].state = true;
                members[memberId].weight = _weight;
                totalWeight += _weight;
                totalMember++;
                emit addMemberSuccess(memberId);
            }else{
                emit addMemberExisted(existed[_memberAddr]);
            }
        }
    }

    function deleteMember(address _memberAddr) public onlyOwner() {
        require(existed[_memberAddr] != 0, "DeleteMember Failed: This address is not a member.");
        require(members[existed[_memberAddr]].state == true, "DeleteMember Failed: This address is not active.");
        uint256 memberId = existed[_memberAddr];
        members[memberId].state = false;
        members[memberId].weight = 0;
        totalWeight -= members[memberId].weight;
        totalMember--;
        emit deleteMemberSuccess(memberId);
    }

    function checkMemberNum() public view returns(bool) {
        return (totalMember >= minMember);
    }

    function getMemberInfo() public view returns(address[] memory,uint256[] memory,uint256) {
        address[] memory memberAddress;
        uint256[] memory memberWeight;
        uint256 vaildMember = 0;
        for(uint256 i = 1; i < _nextMemberId; i++){
            Member memory m = members[i];
            if(m.state == true){
                memberAddress[vaildMember] = m.memberAddress;
                memberWeight[vaildMember] = m.weight;
                vaildMember++;
            }
        }
        return (memberAddress,memberWeight,totalWeight);
    }
}