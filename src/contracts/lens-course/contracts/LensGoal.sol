// SPDX-License-Identifier: MIT

// $$\                                           $$$$$$\                      $$\
// $$ |                                         $$  __$$\                     $$ |
// $$ |      $$$$$$\  $$$$$$$\   $$$$$$$\       $$ /  \__| $$$$$$\   $$$$$$\  $$ |
// $$ |     $$  __$$\ $$  __$$\ $$  _____|      $$ |$$$$\ $$  __$$\  \____$$\ $$ |
// $$ |     $$$$$$$$ |$$ |  $$ |\$$$$$$\        $$ |\_$$ |$$ /  $$ | $$$$$$$ |$$ |
// $$ |     $$   ____|$$ |  $$ | \____$$\       $$ |  $$ |$$ |  $$ |$$  __$$ |$$ |
// $$$$$$$$\\$$$$$$$\ $$ |  $$ |$$$$$$$  |      \$$$$$$  |\$$$$$$  |\$$$$$$$ |$$ |
// \________|\_______|\__|  \__|\_______/        \______/  \______/  \_______|\__|

// Team Lens Handles:
// cryptocomical.lens       | Designer
// (Add Greg's name here)   | Front-End and Smart Contract developer
// leoawolanski.lens        | Smart Contract Developer

pragma solidity 0.8.17;

import "./LensGoalHelpers.sol";
import "./AutomationCompatible.sol";
import "./AutomationCompatibleInterface.sol";

contract LensGoal is LensGoalHelpers {
    // wallet where funds will be transfered in case of goal failure
    // is currently the 0 address for simplicity, edit later

    address communityWallet = address(0);
    uint256 constant HOURS_24 = 1 days;
    uint256 constant MINUTES_6 = 60 * 6;

    // used to identify whether stake is in ether or erc20
    enum TokenType {
        ETHER,
        ERC20
    }

    // GoalStatus enum, used to check goal status (e.g. "pending", "true", "false")
    enum Status {
        PENDING,
        VOTED_TRUE,
        VOTED_FALSE
    }

    struct Votes {
        uint256 yes;
        uint256 no;
    }

    struct Stake {
        // stake can be ether or erc20
        TokenType tokenType;
        uint256 amount;
        // is address(0) if token type is ether
        address tokenAddress;
    }

    struct GoalBasicInfo {
        address user;
        string description;
        string verificationCriteria;
        uint256 deadline;
        Status status;
        uint256 goalId;
    }

    struct Goal {
        GoalBasicInfo info;
        Stake stake;
        Votes votes;
        // AdditionalStake[] additionalstakes;
        string[] proofs;
    }

    struct AdditionalStake {
        Stake stake;
        uint256 stakeId;
        // which goal this stake belongs to
        uint256 goalId;
        address staker;
        // used for withdrawStake()
        // if withdraw == true, stake cannot be withdrawn
        bool withdrawn;
    }

    // get address's stake and goal ids
    mapping(address => uint256[]) public userToGoalIds;
    mapping(address => uint256[]) public userToStakeIds;
    // each id is a goal or stake
    mapping(uint256 => Goal) public goalIdToGoal;
    mapping(uint256 => AdditionalStake) public stakeIdToStake;

    // will be incremented when new goals/stakes are published
    uint256 goalId;
    uint256 stakeId;

    function makeNewGoal(
        string memory description,
        string memory verificationCriteria,
        bool inEther,
        uint256 tokenAmount,
        address tokenAddress,
        uint256 timestampEnd
    ) external payable {
        if (inEther) {
            require(msg.value > 0, "msg.value must be greater than 0");
            // AdditionalStake[] memory additionalstakes;
            string[] memory proofs;
            Goal memory goal = Goal(
                GoalBasicInfo(
                    msg.sender,
                    description,
                    verificationCriteria,
                    timestampEnd,
                    Status.PENDING,
                    goalId
                ),
                defaultEtherStake(),
                Votes(0, 0),
                // additionalstakes,
                proofs
            );
            userToGoalIds[msg.sender].push(goalId);
            goalIdToGoal[goalId] = goal;
            // increment goalId for later goal instantiation
            goalId++;
        } else {
            // safety check
            require(tokenAmount > 0, "tokenAmount must be greater than 0");
            // transfer tokens to contracts
            require(
                IERC20(tokenAddress).transferFrom(
                    msg.sender,
                    address(this),
                    tokenAmount
                ) == true,
                "token transfer failed. check your approvals"
            );
            // AdditionalStake[] memory additionalstakes;
            string[] memory proofs;
            Goal memory goal = Goal(
                GoalBasicInfo(
                    msg.sender,
                    description,
                    verificationCriteria,
                    timestampEnd,
                    Status.PENDING,
                    goalId
                ),
                defaultEtherStake(),
                Votes(0, 0),
                // additionalstakes,
                proofs
            );
            userToGoalIds[msg.sender].push(goalId);
            goalIdToGoal[goalId] = goal;
            goalId++;
        }
    }

    // function makeNewStake(
    //     /* which goal the stake is for**/ uint256 _goalId,
    //     bool inEther,
    //     uint256 tokenAmount,
    //     address tokenAddress
    // ) external payable {
    //     if (inEther) {
    //         require(msg.value > 0, "msg.value must be greater than 0");
    //         AdditionalStake memory stake = AdditionalStake(
    //             defaultEtherStake(),
    //             stakeId,
    //             _goalId,
    //             msg.sender,
    //             false
    //         );
    //         userToStakeIds[msg.sender].push(stakeId);
    //         goalIdToGoal[_goalId].additionalstakes.push(stake);
    //         stakeIdToStake[stakeId] = stake;
    //         stakeId++;
    //     } else {
    //         require(tokenAmount > 0, "tokenAmount must be greater than 0");
    //         AdditionalStake memory stake = AdditionalStake(
    //             Stake(TokenType.ERC20, tokenAmount, tokenAddress),
    //             stakeId,
    //             _goalId,
    //             msg.sender,
    //             false
    //         );
    //         userToStakeIds[msg.sender].push(stakeId);
    //         goalIdToGoal[_goalId].additionalstakes.push(stake);
    //         stakeIdToStake[stakeId] = stake;
    //         stakeId++;
    //     }
    // }

    function defaultEtherStake() internal view returns (Stake memory) {
        return Stake(TokenType.ETHER, msg.value, address(0));
    }

    function writeProofs(
        /** take input of strings (links, etc.) */ string[] memory _proofs,
        uint256 _goalId
    ) external {
        // check for user to be goal initiator
        require(
            goalIdToGoal[_goalId].info.user == msg.sender,
            "not goal creator"
        );
        // iterate through each proof and append to proofs list
        for (uint256 i; i < goalId; i++) {
            goalIdToGoal[_goalId].proofs.push(_proofs[i]);
        }
    }

    function getBasicInfo(
        uint256 _goalId
    ) public view returns (GoalBasicInfo memory) {
        return goalIdToGoal[_goalId].info;
    }

    function vote(
        uint256 _goalId,
        bool input
    ) external windowOpen(goalIdToGoal[_goalId].info.deadline) {
        Goal storage goal = goalIdToGoal[_goalId];
        if (input == true) {
            goal.votes.yes++;
        } else {
            goal.votes.no++;
        }
    }

    // checks if voting window is open
    modifier windowOpen(uint256 startTimestamp) {
        require(
            block.timestamp > startTimestamp &&
                block.timestamp < startTimestamp + 1 days
        );
        _;
    }

    // function withdrawStake(uint256 _stakeId) external {
    //     AdditionalStake memory stake = stakeIdToStake[_stakeId];
    //     // identity check
    //     require(stake.staker == msg.sender, "not staker");
    //     // if stake is in ether, send ether back to msg.sender and set withdrawn to true
    //     if (stake.stake.tokenType == TokenType.ETHER) {
    //         payable(msg.sender).transfer(stake.stake.amount);
    //         stake.withdrawn = true;
    //     } else {
    //         IERC20(stake.stake.tokenAddress).transfer(
    //             msg.sender,
    //             stake.stake.amount
    //         );
    //         stake.withdrawn = true;
    //     }
    // }
}
