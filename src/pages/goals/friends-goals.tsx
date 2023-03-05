import { useEffect, useState } from "react";
import {
  MediaRenderer,
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { useFollowingQuery } from "../../graphql/generated";
import OracleHero from "../../components/OracleHero";
import Button from "../../components/Button";
import GoalCard from "../../components/GoalCard";
import { UseQueryResult } from "@tanstack/react-query";
import { getGoalsArray, GoalsByUserAndVotingStatus } from "../../types/types";
import { LENS_GOAL_CONTRACT_ADDRESS } from "../../const/contracts";

export enum GoalStatus {
  "pending",
  "open",
  "closed",
}

export default function FriendsGoals() {
  const address = useAddress();
  const [goalStatus, setGoalStatus] = useState<GoalStatus>(GoalStatus.pending);
  const [addresses, setAddresses] = useState<string[]>([]);

  const { isLoading, error, data } = useFollowingQuery({
    request: {
      address,
    },
  });

  const { contract } = useContract(LENS_GOAL_CONTRACT_ADDRESS);
  const {
    data: goalsData,
    isLoading: goalsLoading,
  }: UseQueryResult<GoalsByUserAndVotingStatus, unknown> = useContractRead(
    contract,
    "getGoalsByUsersAndVotingStatus",
    addresses,
    goalStatus
  );

  useEffect(() => {
    console.log(data);
    setAddresses(
      data?.following.items.map((item) => item.profile.ownedBy) || []
    );
  }, [data]);

  if (error) {
    return <div>Error...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function getProfilesMap() {
    return data?.following.items.reduce<any>((acc, cur) => {
      acc[cur.profile.ownedBy as string] = cur.profile;
      return acc;
    }, {});
  }

  const profilesMap = getProfilesMap();
  console.log(goalsData);
  return (
    <div>
      <div className="py-6">
        <OracleHero />
      </div>
      <div className="flex justify-center">
        <Button
          text="Pending"
          cb={() => setGoalStatus(GoalStatus.pending)}
        ></Button>
        <Button text="Open" cb={() => setGoalStatus(GoalStatus.open)}></Button>
        <Button
          text="Closed"
          cb={() => setGoalStatus(GoalStatus.closed)}
        ></Button>
      </div>
      {goalsData &&
        getGoalsArray(goalsData).map((goal) => {
          return (
            <GoalCard
              key={goal.info.goalId._hex}
              description={goal.info.description}
              profile={profilesMap[goal.info.user]}
              status={goal.info.status}
              id={goal.info.goalId}
              deadline={goal.info.deadline}
            />
          );
        })}
    </div>
  );
}
