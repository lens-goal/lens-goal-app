import { useEffect, useState } from 'react'
import { MediaRenderer, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import {
  useFollowingQuery,
} from "../../graphql/generated";
import OracleHero from '../../components/OracleHero';
import Button from '../../components/Button';
import GoalCard from '../../components/GoalCard';
import { UseQueryResult } from '@tanstack/react-query';
import { getGoalsArray, GoalsByUserAndVotingStatus } from '../../types/types';

export enum GoalStatus  {
  'pending',
  'open',
  'closed'
} 
// 'complete' | 'voting' | 'ongoing'

export default function FriendsGoals
() {
  const address = useAddress();
  const [goalStatus, setGoalStatus] = useState<GoalStatus>(GoalStatus.pending)
  const [addresses, setAddresses] = useState<string[]>([])

  const { isLoading, error, data } = useFollowingQuery(
    {
      request: {
        address,
      },
    },
    {
      // Don't refetch the user comes back
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
    }
  );

  const { contract } = useContract("0xDCFa9da3e6e4d994Dc3E8D42cabfe86Afd34F857");
  const { data: goalsData, isLoading: goalsLoading } : UseQueryResult<GoalsByUserAndVotingStatus, unknown> = useContractRead(contract, "getGoalsByUsersAndVotingStatus", addresses, goalStatus)
  

  useEffect(()=>{
   setAddresses(data?.following.items.map(item=>item.profile.ownedBy) || [])
  },[data])

  
  if (error) {
    return <div>Error...</div>;
  }
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  function getProfilesMap(){
    return data?.following.items.reduce<any>((acc,cur)=>{
      acc[cur.profile.ownedBy as string] = cur.profile;
      return acc
    },{})
  }

  const profilesMap = getProfilesMap()

  return (
    <div>
      <div className='py-6'>
        <OracleHero/>
      </div>
      <div className='flex justify-center'>
        <Button text='Pending' cb={()=>setGoalStatus(GoalStatus.pending)}></Button>
        <Button text='Open' cb={()=>setGoalStatus(GoalStatus.open)}></Button>
        <Button text='Closed' cb={()=>setGoalStatus(GoalStatus.closed)}></Button>
      </div>
      {goalsData && getGoalsArray(goalsData).map((goal)=>{
        return <GoalCard 
          key={goal.info.goalId._hex} 
          description={goal.info.description} 
          profile={profilesMap[goal.info.user]} 
          deadline={goal.info.deadline}/>
      })}
      {/* {data?.following.items.map(({profile})=><div className='mb-4' key={profile.ownedBy}>
      <GoalCard profile={profile}/>
        </div>)} */}
    </div>
  );
}
