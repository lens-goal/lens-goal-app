export enum TokenType {
    ETHER,
    ERC20
}

export enum Status {
    PENDING,
    VOTED_TRUE,
    VOTED_FALSE
}

export interface BigNumberMetaData {
  _type: string,
  _hex: string
}
export type Address = string
export type PreProof = string
export type Proof = string
export type VotesTuple = [BigNumberMetaData, BigNumberMetaData]
export type StakeTuple = [TokenType, BigNumberMetaData, Address]
export type GoalBasicInfoTuple = [Address, string, string, BigNumberMetaData, number, BigNumberMetaData]
export type GoalTuple = [GoalBasicInfoTuple, StakeTuple, VotesTuple, PreProof, Proof]
export type GoalsByUserAndVotingStatus = GoalTuple[]

export interface Stake {
    tokenType: TokenType,
    amount: BigNumberMetaData,
    tokenAddress: Address
}

export interface Votes {
    yes: BigNumberMetaData,
    no: BigNumberMetaData,
}

export interface GoalBasicInfo {
    user: Address
    description: string,
    verificationCriteria: string,
    deadline: BigNumberMetaData,
    status: Status,
    goalId: BigNumberMetaData
}

export interface Goal {
    info: GoalBasicInfo,
    stake: Stake,
    votes: Votes
    preProof: string,
    proof: string
}

export function getGoalFromGoalTuple(goalTuple: GoalTuple){
    const [goalBasicInfoTuple,stakeTuple,votesTuple,preProof,proof] = goalTuple

     return {
        info: {
            user: goalBasicInfoTuple[0],
            description: goalBasicInfoTuple[1],
            verificationCriteria: goalBasicInfoTuple[2],
            deadline: goalBasicInfoTuple[3],
            status: goalBasicInfoTuple[4],
            goalId: goalBasicInfoTuple[5]
        },
        stake: {
            tokenType: stakeTuple[0],
            amount: stakeTuple[1],
            tokenAddress: stakeTuple[2]
        },
        votes: {
            yes: votesTuple[0],
            no: votesTuple[0],
        },
        preProof,
        proof
    }
}

export function getGoalsArray(goals: GoalsByUserAndVotingStatus) {
    return goals.map<Goal>(getGoalFromGoalTuple)
}