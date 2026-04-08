// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract ElectionFaucet is Ownable {
    enum Candidate {
        None,
        Trump,
        Biden
    }

    IERC20 public immutable trumpToken;
    IERC20 public immutable bidenToken;

    uint256 public rewardAmount;

    uint256 public trumpVotes;
    uint256 public bidenVotes;

    mapping(address => bool) public hasVoted;
    mapping(address => Candidate) public votedFor;

    event VotedAndClaimed(
        address indexed voter,
        Candidate indexed candidate,
        uint256 rewardAmount
    );

    event RewardAmountUpdated(uint256 oldAmount, uint256 newAmount);
    event CandidateFunded(Candidate indexed candidate, uint256 amount);
    event EmergencyWithdraw(
        Candidate indexed candidate,
        address indexed to,
        uint256 amount
    );

    error AlreadyVoted();
    error InvalidCandidate();
    error FaucetEmpty();
    error TransferFailed();

    constructor(
        address _trumpToken,
        address _bidenToken,
        uint256 _rewardAmount,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_trumpToken != address(0), "Invalid trump token");
        require(_bidenToken != address(0), "Invalid biden token");
        require(_rewardAmount > 0, "Invalid reward amount");

        trumpToken = IERC20(_trumpToken);
        bidenToken = IERC20(_bidenToken);
        rewardAmount = _rewardAmount;
    }

    function voteTrump() external {
        _voteAndClaim(Candidate.Trump);
    }

    function voteBiden() external {
        _voteAndClaim(Candidate.Biden);
    }

    function voteAndClaim(Candidate candidate) external {
        _voteAndClaim(candidate);
    }

    function _voteAndClaim(Candidate candidate) internal {
        if (hasVoted[msg.sender]) revert AlreadyVoted();
        if (candidate != Candidate.Trump && candidate != Candidate.Biden) {
            revert InvalidCandidate();
        }

        hasVoted[msg.sender] = true;
        votedFor[msg.sender] = candidate;

        if (candidate == Candidate.Trump) {
            trumpVotes += 1;

            if (trumpToken.balanceOf(address(this)) < rewardAmount) {
                revert FaucetEmpty();
            }

            bool success = trumpToken.transfer(msg.sender, rewardAmount);
            if (!success) revert TransferFailed();
        } else {
            bidenVotes += 1;

            if (bidenToken.balanceOf(address(this)) < rewardAmount) {
                revert FaucetEmpty();
            }

            bool success = bidenToken.transfer(msg.sender, rewardAmount);
            if (!success) revert TransferFailed();
        }

        emit VotedAndClaimed(msg.sender, candidate, rewardAmount);
    }

    function setRewardAmount(uint256 newRewardAmount) external onlyOwner {
        require(newRewardAmount > 0, "Invalid reward amount");

        uint256 oldAmount = rewardAmount;
        rewardAmount = newRewardAmount;

        emit RewardAmountUpdated(oldAmount, newRewardAmount);
    }

    function fundTrump(uint256 amount) external onlyOwner {
        require(amount > 0, "Invalid amount");

        bool success = trumpToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!success) revert TransferFailed();

        emit CandidateFunded(Candidate.Trump, amount);
    }

    function fundBiden(uint256 amount) external onlyOwner {
        require(amount > 0, "Invalid amount");

        bool success = bidenToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!success) revert TransferFailed();

        emit CandidateFunded(Candidate.Biden, amount);
    }

    function emergencyWithdrawTrump(
        address to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "Invalid receiver");
        require(amount > 0, "Invalid amount");

        bool success = trumpToken.transfer(to, amount);
        if (!success) revert TransferFailed();

        emit EmergencyWithdraw(Candidate.Trump, to, amount);
    }

    function emergencyWithdrawBiden(
        address to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "Invalid receiver");
        require(amount > 0, "Invalid amount");

        bool success = bidenToken.transfer(to, amount);
        if (!success) revert TransferFailed();

        emit EmergencyWithdraw(Candidate.Biden, to, amount);
    }

    function totalVotes() external view returns (uint256) {
        return trumpVotes + bidenVotes;
    }

    function getVoteResult(address user) external view returns (Candidate) {
        return votedFor[user];
    }

    function getBalances()
        external
        view
        returns (uint256 trumpBalance, uint256 bidenBalance)
    {
        trumpBalance = trumpToken.balanceOf(address(this));
        bidenBalance = bidenToken.balanceOf(address(this));
    }
}
