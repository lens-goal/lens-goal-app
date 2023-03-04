export interface BigNumberMetaData {
  type: string,
  hex: string
}
export type Address = string
export type VotesTuple = [BigNumberMetaData, BigNumberMetaData]
export type StakeTuple = [number, BigNumberMetaData, Address]
export type GoalBasicInfoTuple = [Address, string, string, BigNumberMetaData, number, BigNumberMetaData]
export type GoalTuple = [GoalBasicInfoTuple,StakeTuple,VotesTuple,string,string]
export type GoalsByUserAndVotingStatus = GoalTuple[]