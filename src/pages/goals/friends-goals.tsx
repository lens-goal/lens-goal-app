// import FeedPost from "../components/FeedPost";
import { useState } from 'react'
import { MediaRenderer, useAddress } from "@thirdweb-dev/react";
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  useFollowingQuery,
} from "../../graphql/generated";
// import styles from "../styles/Home.module.css";

export default function FriendsGoals
() {
  const address = useAddress();
  const [friendsAdresses, setFriendsAddresses] = useState<string[]>([])

  const { isLoading, error, data } = useFollowingQuery(
    {
      request: {
        address,
        // limit: 10,
        // cursor: 0
        // profileId: address
        // sortCriteria: PublicationSortCriteria.Latest,
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
