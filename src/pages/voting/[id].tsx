import React from "react";
import { useRouter } from "next/router";
import OracleHero from "../../components/OracleHero";
import { usePublicationQuery } from "../../graphql/generated";
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { LENS_GOAL_CONTRACT_ADDRESS } from "../../const/contracts";
import { UseQueryResult } from "@tanstack/react-query";
import { getGoalFromGoalTuple, GoalTuple } from "../../types/types";
import { parseDateFromBigNumber } from "../../utils/parseDateFromBigNumber";
import HugeButton from "../../components/HugeButton";

type Props = {};

export default function VotingPage({}: Props) {
  const router = useRouter();
  // Grab the path / [id] field from the URL
  const { id } = router.query;

  const { contract } = useContract(LENS_GOAL_CONTRACT_ADDRESS);
  const { data, isLoading }: UseQueryResult<GoalTuple, unknown> = useContractRead(contract, "getGoalByGoalId", id)
  const { mutateAsync: vote, isLoading: voteIsLoadnig } = useContractWrite(contract, "vote")

  // jeden POST z preProof, zrobić drugi tak samo z Proof
  const publication = usePublicationQuery({
    request: {
      // wyciągnąć id z daty
      publicationId: data,
    },
  
    // wyciągnąć id z daty
  }, {enabled: !!data})

  // const { mutateAsync: followUser } = useFollow();

  // const {
  //   isLoading: loadingProfile,
  //   data: profileData,
  //   error: profileError,
  // } = useProfileQuery(
  //   {
  //     request: {
  //       handle: id,
  //     },
  //   },
  //   {
  //     enabled: !!id,
  //   }
  // );

  // const {
  //   isLoading: isLoadingPublications,
  //   data: publicationsData,
  //   error: publicationsError,
  // } = usePublicationsQuery(
  //   {
  //     request: {
  //       profileId: profileData?.profile?.id,
  //     },
  //   },
  //   {
  //     enabled: !!profileData?.profile?.id,
  //   }
  // );

  // if (publicationsError || profileError) {
  //   return <div>Could not find this profile.</div>;
  // }

  // if (loadingProfile) {
  //   return <div>Loading profile...</div>;
  // }
  async function sendVote(input: boolean){
    try {
      const data = await vote([ id, input ]);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  if(!data) return

  const goal = getGoalFromGoalTuple(data)

  return (
    <div>
      <div className='py-6'>
        <OracleHero/>
        <p className="text-center">
          {} declared by <strong>{parseDateFromBigNumber(goal.info.deadline)}</strong> they would <strong>{goal.info.description}</strong> and provide <strong>{goal.info.verificationCriteria}</strong> as proof.
          <br></br>
          They have provided the proof above.
          <br></br>
          I, hereby declare, that in my opinion {} has:
        </p>
        <div className="flex justify-around">
          <HugeButton cb={()=>sendVote(true)}>
            <span className="block">Reached their</span>
            <span className="block">LENS GOAL</span>
          </HugeButton>
          <HugeButton cb={()=>sendVote(false)}>Flunked It</HugeButton>
        </div>
      </div>
    </div>
  );
}
