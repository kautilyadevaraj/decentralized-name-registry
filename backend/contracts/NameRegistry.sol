// contracts/NameRegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract NameRegistry {
    struct NameRecord {
        address owner;
        uint256 registrationDate;
        uint256 expiry;
    }

    mapping(string => NameRecord) public names;

    mapping(address => string[]) public ownerNames;

    event NameRegistered(string name, address owner, uint256 registrationDate, uint256 expiry);

    function register(string calldata name, uint256 durationYears) external payable {
        require(bytes(name).length > 0, "Invalid name");
        require(names[name].owner == address(0) || block.timestamp > names[name].expiry, "Already registered");

        uint256 duration = durationYears * 365 days;
        require(msg.value >= durationYears * 0.01 ether, "Insufficient fee");

        uint256 regDate = block.timestamp;
        uint256 expiryDate = regDate + duration;

        names[name] = NameRecord(msg.sender, regDate, expiryDate);
        ownerNames[msg.sender].push(name);

    emit NameRegistered(name, msg.sender, regDate, expiryDate);
    }

    function renew(string calldata name, uint256 durationYears) external payable {
        require(names[name].owner == msg.sender, "Only owner can renew");
        require(block.timestamp <= names[name].expiry, "Name already expired");

        uint256 additionalTime = durationYears * 365 days;
        uint256 additionalFee = durationYears * 0.01 ether;
        require(msg.value >= additionalFee, "Insufficient fee");

        names[name].expiry += additionalTime;
    }

    function transfer(string calldata name, address newOwner) external {
        require(names[name].owner == msg.sender, "Only owner can transfer");
        require(newOwner != address(0), "Invalid new owner");

        // Remove from previous owner's list
        string[] storage previousList = ownerNames[msg.sender];
        for (uint i = 0; i < previousList.length; i++) {
            if (keccak256(bytes(previousList[i])) == keccak256(bytes(name))) {
                previousList[i] = previousList[previousList.length - 1];
                previousList.pop();
                break;
            }
        }

        // Add to new owner's list
        ownerNames[newOwner].push(name);

        names[name].owner = newOwner;
    }

    function isAvailable(string calldata name) external view returns (bool) {
        return names[name].owner == address(0) || block.timestamp > names[name].expiry;
    }

    function getOwner(string calldata name) external view returns (address) {
        return names[name].owner;
    }

    function getRegistrationDate(string calldata name) external view returns (uint256) {
        return names[name].registrationDate;
    }

    function getExpiry(string calldata name) external view returns (uint256) {
        return names[name].expiry;
    }

    function getNamesByOwner(address user) external view returns (string[] memory) {
    return ownerNames[user];
}
}
