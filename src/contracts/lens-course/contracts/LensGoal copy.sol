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
// grzegorz.lens            | Front-End and Smart Contract Developer
// leoawolanski.lens        | Smart Contract Engineer
// cryptocomical.lens       | Designer

pragma solidity 0.8.17;
pragma experimental ABIEncoderV2;

import "./LensGoalHelpers.sol";
import "./AutomationCompatible.sol";
import "./AutomationCompatibleInterface.sol";

contract LensGoal is LensGoalHelpers, AutomationCompatibleInterface {
    // wallet where funds will be transfered in case of goal failure
    // is currently the undefined, edit later

    address communityWallet;

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

    enum VotingStatus {
        PENDING,
        OPEN,
        CLOSED
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
        string preProof;
        string proof;
    }

    struct Charity {
        address account;
        string name;
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
    // each id = goal
    mapping(uint256 => Goal) public goalIdToGoal;
    // each id = stake
    mapping(uint256 => AdditionalStake) public stakeIdToStake;
    // maps goal to all stakeId of stakes for that goal
    mapping(uint256 => uint256[]) goalIdToStakeIds;

    // address[] public charityList;
    // mapping(address => Charity) public charityIdToCharity;

    // will be incremented when new goals/stakes are published
    uint256 goalId;
    uint256 stakeId;

    // events
    event GoalCreated(
        address indexed _user,
        string _description,
        string _verificationCriteria,
        uint256 _deadline,
        Status _status,
        uint256 indexed _goalId
    );

    event AdditionalStakeCreated(
        address indexed _staker,
        TokenType _tokenType,
        uint256 _amount,
        address _tokenAddress,
        uint256 indexed _stakeId,
        uint256 indexed _goalId
    );

    event StakeWithdrawn(
        TokenType _tokenType,
        uint256 _amount,
        address _tokenAddress,
        uint256 indexed _stakeId,
        uint256 indexed _goalId,
        address indexed _staker
    );

    event ProofAdded(
        address indexed _user,
        string _proof,
        uint256 indexed _goalId
    );

    event VoteCasted(address indexed _voter, bool _vote, uint256 _goalId);

    // function addCharity(address account, string calldata name) external {
    //     if (charityIdToCharity[account].account == address(0)) {
    //         charityList.push(account);
    //         charityIdToCharity[account] = Charity(account, name);
    //     }
    // }

    // function getCharities()
    //     external
    //     view
    //     onlyOwners
    //     returns (Charity[] memory)
    // {
    //     Charity[] memory charities = new Charity[](charityList.length);
    //     for (uint256 i; i < charityList.length; i++) {
    //         charities[i] = charityIdToCharity[charityList[i]];
    //     }
    //     return charities;
    // }

    // allows user to make a new goal
    function makeNewGoal(
        string memory description,
        string memory verificationCriteria,
        bool inEther,
        uint256 tokenAmount,
        address tokenAddress,
        uint256 timestampEnd,
        string memory preProof
    ) external payable {
        if (inEther) {
            // require(msg.value > 0, "msg.value must be greater than 0");
            // why user can stake nothing:
            // so that user can have friends stake as "rewards" and themselves stake nothing
            userToGoalIds[msg.sender].push(goalId);
            goalIdToGoal[goalId] = Goal(
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
                preProof,
                ""
            );
            emit GoalCreated(
                msg.sender,
                description,
                verificationCriteria,
                timestampEnd,
                Status.PENDING,
                goalId
            );
            // increment goalId for later goal instantiation
            goalId++;
        } else {
            // require(tokenAmount > 0, "tokenAmount must be greater than 0");
            // transfer tokens to contracts
            require(
                IERC20(tokenAddress).transferFrom(
                    msg.sender,
                    address(this),
                    tokenAmount
                ) == true,
                "token transfer failed. check your approvals"
            );
            Goal memory goal = Goal(
                // define info struct
                GoalBasicInfo(
                    msg.sender,
                    description,
                    verificationCriteria,
                    timestampEnd,
                    Status.PENDING,
                    goalId
                ),
                // get etherstake struct
                defaultEtherStake(),
                // votes struct
                Votes(0, 0),
                preProof,
                ""
            );
            // push goalId
            userToGoalIds[msg.sender].push(goalId);
            // define goalId
            goalIdToGoal[goalId] = goal;
            emit GoalCreated(
                msg.sender,
                description,
                verificationCriteria,
                timestampEnd,
                Status.PENDING,
                goalId
            );
            // increment goalId (for future use)
            goalId++;
        }
    }

    // used in frontend
    function getGoalByGoalId(
        uint256 _goalId
    ) public view returns (Goal memory) {
        return goalIdToGoal[_goalId];
    }

    function getStakeByStakeId(
        uint256 _stakeId
    ) public view returns (AdditionalStake memory) {
        return stakeIdToStake[_stakeId];
    }

    // quickly get a Stake struct where token is ether
    function defaultEtherStake() internal view returns (Stake memory) {
        return Stake(TokenType.ETHER, msg.value, address(0));
    }

    // allows users to make additional stakes
    // function makeNewStake(
    //     /* which goal the stake is for**/ uint256 _goalId,
    //     bool inEther,
    //     uint256 tokenAmount,
    //     address tokenAddress
    // ) external payable {
    //     if (inEther) {
    //         // cannot stake 0 tokens
    //         require(msg.value > 0, "msg.value must be greater than 0");
    //         AdditionalStake memory stake = AdditionalStake(
    //             defaultEtherStake(),
    //             stakeId,
    //             _goalId,
    //             msg.sender,
    //             false
    //         );
    //         // push stakeId
    //         userToStakeIds[msg.sender].push(stakeId);
    //         // add stake to goal
    //         goalIdToStakeIds[_goalId].push(stakeId);
    //         // define stake in mapping
    //         stakeIdToStake[stakeId] = stake;
    //         emit AdditionalStakeCreated(
    //             msg.sender,
    //             TokenType.ETHER,
    //             msg.value,
    //             address(0),
    //             stakeId,
    //             _goalId
    //         );
    //         // increment stakeId for future use
    //         stakeId++;
    //     } else {
    //         // cannot stake 0 tokens
    //         require(tokenAmount > 0, "tokenAmount must be greater than 0");
    //         AdditionalStake memory stake = AdditionalStake(
    //             Stake(TokenType.ERC20, tokenAmount, tokenAddress),
    //             stakeId,
    //             _goalId,
    //             msg.sender,
    //             false
    //         );
    //         // push stakeId
    //         userToStakeIds[msg.sender].push(stakeId);
    //         // add stake to goal
    //         goalIdToStakeIds[_goalId].push(stakeId);
    //         // define stake in mapping
    //         stakeIdToStake[stakeId] = stake;
    //         emit AdditionalStakeCreated(
    //             msg.sender,
    //             TokenType.ERC20,
    //             tokenAmount,
    //             tokenAddress,
    //             stakeId,
    //             _goalId
    //         );
    //         // increment stakeId for future use
    //         stakeId++;
    //     }
    // }

    // users can write or link to proof on chain to convince voters to vote positevely
    function writeProofs(
        /** input of strings to write */ string memory proof,
        uint256 _goalId
    ) external {
        // check for user to be goal initiator
        require(
            goalIdToGoal[_goalId].info.user == msg.sender,
            "not goal creator"
        );
        // update proof
        goalIdToGoal[_goalId].proof = proof;
        emit ProofAdded(msg.sender, proof, _goalId);
    }

    // get info of goal (for front end)
    // function getGoalBasicInfo(
    //     uint256 _goalId
    // ) public view returns (GoalBasicInfo memory) {
    //     return goalIdToGoal[_goalId].info;
    // }

    // vote on goal
    function vote(
        uint256 _goalId,
        bool input
    )
        external
        // only followers can vote. modifier code is in LensGoalHelpers.sol
        isFollowingAddress(goalIdToGoal[_goalId].info.user, msg.sender)
        /** make sure voting windows is open */ windowOpen(
            goalIdToGoal[_goalId].info.deadline
        )
    {
        require(goalIdToGoal[_goalId].info.status == Status.PENDING);
        if (input == true) {
            goalIdToGoal[_goalId].votes.yes++;
        } else {
            goalIdToGoal[_goalId].votes.no++;
        }
        emit VoteCasted(msg.sender, input, _goalId);
    }

    // checks if voting window is open
    modifier windowOpen(uint256 startTimestamp) {
        require(
            block.timestamp > startTimestamp &&
                // voting window is one day long, starts at deadline and ends at deadline + 1 days
                block.timestamp < startTimestamp + 1 days
        );
        _;
    }

    // allows stakers to withdraw stake so that they don't purposely vote negatively to get it back
    // function withdrawStake(uint256 _stakeId) external {
    //     AdditionalStake memory stake = stakeIdToStake[_stakeId];
    //     // identity check
    //     require(stake.staker == msg.sender, "not staker");
    //     // safety check
    //     require(stake.withdrawn == false, "stake already withdrawn");
    //     // if stake is in ether, send ether back to msg.sender and set withdrawn to true
    //     if (stake.stake.tokenType == TokenType.ETHER) {
    //         stakeIdToStake[_stakeId].withdrawn = true;
    //         payable(msg.sender).transfer(stake.stake.amount);
    //     } else {
    //         stakeIdToStake[_stakeId].withdrawn = true;
    //         IERC20(stake.stake.tokenAddress).transfer(
    //             msg.sender,
    //             stake.stake.amount
    //         );
    //     }
    //     emit StakeWithdrawn(
    //         stake.stake.tokenType,
    //         stake.stake.amount,
    //         stake.stake.tokenAddress,
    //         stake.stakeId,
    //         stake.goalId,
    //         stake.staker
    //     );
    // }

    function votingWindowClosedAndStatusIsPending(
        uint256 _goalId
    ) internal view returns (bool) {
        Goal memory goal = goalIdToGoal[_goalId];
        return
            block.timestamp > goal.info.deadline + 1 days &&
            goal.info.status == Status.PENDING;
    }

    // Chainlink view function. If returns true, Chainlink will run state-changing performUpkeep() function
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        for (uint256 i; i < goalId; i++) {
            if (votingWindowClosedAndStatusIsPending(i)) {
                return (true, bytes("LensGoal"));
            }
        }
        return (false, bytes("LensGoal"));
    }

    // Chainlink state changing transaction. Will run if checkUpkeep() returns true
    function performUpkeep(bytes calldata /* performData */) external override {
        // loop through all goals
        for (uint256 i; i < goalId; i++) {
            // define goal var
            // check if voting window has closed and Status has not been set to pending
            // if status is pending, that means that the voting window has just closed
            if (votingWindowClosedAndStatusIsPending(i)) {
                // get result of votes
                bool accomplishedGoal = evaluateVotes(i);
                // if voted true, transfer stakes to user and update status
                Goal memory goal = goalIdToGoal[i];
                if (accomplishedGoal) {
                    goalIdToGoal[i].info.status = Status.VOTED_TRUE;
                    transferStakes(accomplishedGoal, goal.info.goalId);
                } else {
                    goalIdToGoal[i].info.status = Status.VOTED_FALSE;
                    transferStakes(accomplishedGoal, goal.info.goalId);
                }
            }
        }
    }

    // function evaluates votes
    function evaluateVotes(uint256 _goalId) internal view returns (bool) {
        Votes memory _votes = goalIdToGoal[_goalId].votes;
        // if 0 votes, send funds back to user
        if (_votes.yes == 0 && _votes.no == 0) {
            return true;
        }
        return _votes.yes >= _votes.no;
    }

    // function transfers additional stakes (if any) and user stake to user/community wallet
    function transferStakes(
        /* stakes will be transfered to user or to community wallet/back to stakers depending on this bool */ bool userAccomplishedGoal,
        uint256 _goalId
    ) internal {
        uint256[] memory stakeIds = goalIdToStakeIds[_goalId];
        // transfer stake to user or wallet, depending on whether or not they achived their goal
        transferUserStake(userAccomplishedGoal, _goalId);
        if (stakeIds.length > 0) {
            if (userAccomplishedGoal) {
                for (uint256 i; i < stakeIds.length; i++) {
                    transferStakeToUser(
                        stakeIdToStake[goalIdToStakeIds[_goalId][i]].stakeId
                    );
                }
            } else {
                for (uint256 i; i < stakeIds.length; i++) {
                    transferStakeBackToStaker(
                        stakeIdToStake[goalIdToStakeIds[_goalId][i]].stakeId
                    );
                }
            }
        }
    }

    // function transfers stake back to its staker
    function transferStakeBackToStaker(uint256 _stakeId) internal {
        AdditionalStake memory stake = stakeIdToStake[_stakeId];
        // safety check
        if (stake.withdrawn == false) {
            if (stake.stake.tokenType == TokenType.ETHER) {
                // if stake is in ether, transfer stake amount back to staker
                stakeIdToStake[_stakeId].withdrawn = true;
                payable(stake.staker).transfer(stake.stake.amount);
            } else {
                stakeIdToStake[_stakeId].withdrawn = true;
                // if stake is in erc20, transfer tokens back to staker
                IERC20(stake.stake.tokenAddress).transfer(
                    stake.staker,
                    stake.stake.amount
                );
            }
        }
    }

    // function transfers stake to user
    function transferStakeToUser(uint256 _stakeId) internal {
        address user = goalIdToGoal[stakeIdToStake[_stakeId].goalId].info.user;
        // local var to save gas
        AdditionalStake memory stake = stakeIdToStake[_stakeId];
        // safety check
        if (stake.withdrawn == false) {
            if (stake.stake.tokenType == TokenType.ETHER) {
                stakeIdToStake[_stakeId].withdrawn = true;
                // if stake is in ether, transfer stake amount to user
                payable(user).transfer(stake.stake.amount);
            } else {
                stakeIdToStake[_stakeId].withdrawn = true;
                // transfer tokens to user
                IERC20(stake.stake.tokenAddress).transfer(
                    user,
                    stake.stake.amount
                );
            }
        }
    }

    // function transfers user stake to user/community wallet
    function transferUserStake(
        bool accomplishedGoal,
        uint256 _goalId
    ) internal {
        // safety check
        // create goal var to save gas
        Goal memory goal = goalIdToGoal[_goalId];
        require(goal.info.status != Status.PENDING, "goal complete");

        if (accomplishedGoal) {
            // if stake is in ether, transfer ether back to user
            if (goal.stake.tokenType == TokenType.ETHER) {
                payable(goal.info.user).transfer(goal.stake.amount);
            }
            // if stake is in erc20, transfer tokens to user
            else {
                IERC20(goal.stake.tokenAddress).transfer(
                    goal.info.user,
                    goal.stake.amount
                );
            }
        } else {
            // if stake is in ether, transfer ether to community wallet
            if (goal.stake.tokenType == TokenType.ETHER) {
                payable(communityWallet).transfer(goal.stake.amount);
            }
            // if stake is in erc20, transfer tokens to community wallet
            else {
                IERC20(goal.stake.tokenAddress).transfer(
                    communityWallet,
                    goal.stake.amount
                );
            }
        }
    }

    function isVotingStatus(
        uint256 _goalId,
        VotingStatus votingStatus
    ) internal view returns (bool) {
        Goal memory goal = goalIdToGoal[_goalId];

        if (votingStatus == VotingStatus.PENDING) {
            return
                goal.info.status == Status.PENDING &&
                block.timestamp < goal.info.deadline;
        } else if (votingStatus == VotingStatus.OPEN) {
            return
                goal.info.status == Status.PENDING &&
                block.timestamp > goal.info.deadline;
        } else {
            return goal.info.status != Status.PENDING;
        }
    }

    function getGoalsByUsersAndVotingStatus(
        address[] memory friends,
        VotingStatus votingStatus
    ) external view returns (Goal[] memory) {
        // 1. First we have to find arrayLength
        uint256 arrayLength;

        for (uint256 i; i < friends.length; i++) {
            uint256[] memory friendGoalIds = userToGoalIds[friends[i]];

            for (uint256 j; j < friendGoalIds.length; j++) {
                if (isVotingStatus(friendGoalIds[j], votingStatus)) {
                    arrayLength++;
                }
            }
        }

        //3. Now we create array in memory
        Goal[] memory goalBasicInfos = new Goal[](arrayLength);

        uint256 index;

        for (uint256 i; i < friends.length; i++) {
            uint256[] memory friendGoalIds = userToGoalIds[friends[i]];

            for (uint256 j; j < friendGoalIds.length; j++) {
                if (isVotingStatus(friendGoalIds[j], votingStatus)) {
                    goalBasicInfos[index] = goalIdToGoal[friendGoalIds[j]];
                    index++;
                }
            }
        }

        return goalBasicInfos;
    }
}
