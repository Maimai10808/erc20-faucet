// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);
}

contract Faucet {
    uint256 public amountAllowed;
    address public tokenContract;
    mapping(address => bool) public requestedAddress;

    event SendToken(address indexed receiver, uint256 indexed amount);

    constructor(address _tokenContract, uint256 _amountAllowed) {
        tokenContract = _tokenContract;
        amountAllowed = _amountAllowed;
    }

    function requestTokens() external {
        require(!requestedAddress[msg.sender], "Can't request multiple times!");

        IERC20 token = IERC20(tokenContract);

        require(
            token.balanceOf(address(this)) >= amountAllowed,
            "Faucet empty!"
        );

        bool success = token.transfer(msg.sender, amountAllowed);
        require(success, "Token transfer failed");

        requestedAddress[msg.sender] = true;

        emit SendToken(msg.sender, amountAllowed);
    }
}
