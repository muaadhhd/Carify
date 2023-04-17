// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Carify is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public _tokenIdCounter;

    uint256 public maxSpots;
    uint256 public price;

    struct ParkingPass {
        uint256 id;
        uint256 expirationDate;
        string licensePlate;
        bool isOwned;
    }

    mapping (string  => ParkingPass) public passHolder;
    // mapping(string => mapping(address => bool)) private registeredLicensePlates;


    constructor(string memory _name, string memory _symbol, uint256 _maxSpots, uint256 _price) 
        ERC721(_name, _symbol) 
    {
        maxSpots = _maxSpots;
        price = _price;
    }

    function buyPass(string memory _licensePlate) public payable returns (uint256)
    {
        require(!isFull(), "Parking Lot is Full");
        require(!isOwned(_licensePlate), "Already Owned");
        require(msg.value >= price, "Amount is not sufficient");

        uint256 newTokenId = _tokenIdCounter.current();

        ParkingPass memory pass = ParkingPass(newTokenId, block.timestamp + 30 days, _licensePlate, true);

        passHolder[_licensePlate] = pass;

        _safeMint(msg.sender, newTokenId);

        _tokenIdCounter.increment();

        // registeredLicensePlates[_licensePlate][msg.sender] = true;

        passHolder[_licensePlate].isOwned = true;

        return newTokenId;
    }

    function renew(string memory _licensePlate) public payable
    {
        ParkingPass storage pass = passHolder[_licensePlate];

        require(pass.isOwned, "Pass does not exist");
        require(_exists(pass.id),"This parking pass does not exist.");
        require(msg.value >= price, "Renewal fee is 0.01 ETH");

        pass.expirationDate += 30 days;
         
    }

    function cancelPass(string memory _licensePlate, uint256 _tokenId) public 
    {

        require(msg.sender == ownerOf(_tokenId), "Not the owner of the pass");
        require(isOwned(_licensePlate), "This parking pass does not exist.");

        delete passHolder[_licensePlate];
        _burn(_tokenId);
        _tokenIdCounter.decrement();
    }


    function getPass(string memory _licensePlate) public view returns (ParkingPass memory)
    {
        return passHolder[_licensePlate];
    }

    function isFull() public view returns (bool) 
    {
        return _tokenIdCounter.current() >= maxSpots;
        
    }

    function isOwned(string memory _licensePlate) public view returns (bool) 
    {
        return passHolder[_licensePlate].isOwned;
    }

    function isPassValid(string memory _licensePlate) public view returns (bool)
    {
        return
            passHolder[_licensePlate].expirationDate > block.timestamp;
    }

    function transferPass(address newOwner, uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "Not the owner");
        _transfer(msg.sender, newOwner, tokenId);
    }
 
    function withdraw() public onlyOwner 
    {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success);
    }
}