import { useState } from 'react'
import { MediaRenderer, useAddress } from "@thirdweb-dev/react";
import {
  useFollowingQuery,
} from "../../graphql/generated";
import OracleHero from '../../components/OracleHero';
import Button from '../../components/Button';
// import styles from "../styles/Home.module.css";

export type GoalStatus = 'complete' | 'voting' | 'ongoing'

export default function FriendsGoals
() {
  const address = useAddress();
  const [goalStatus, setGoalStatus] = useState<GoalStatus>('voting')

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

  

  
  if (error) {
    return <div>Error...</div>;
  }
  
  if (isLoading) {
    return <div>Loading...</div>;
  }



  return (
    <div>
      <div className='py-6'>
        <OracleHero/>
      </div>
      <div className='flex justify-center'>
        <Button text='Complete' cb={()=>setGoalStatus('complete')}></Button>
        <Button text='Voting' cb={()=>setGoalStatus('voting')}></Button>
        <Button text='Ongoing' cb={()=>setGoalStatus('ongoing')}></Button>
      </div>
      {data?.following.items.map(({profile})=><div key={profile.ownedBy}>
        <div>{profile.handle}</div>
        <MediaRenderer
        // @ts-ignore
         src={profile.picture.original.url || ""}
            alt={
              profile.name || profile?.handle || ""
            }></MediaRenderer>
        {profile.ownedBy}</div>)}
    </div>
  );
}
