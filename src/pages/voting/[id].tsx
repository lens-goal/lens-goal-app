import React from "react";
import { useRouter } from "next/router";
import OracleHero from "../../components/OracleHero";
import { usePublicationQuery } from "../../graphql/generated";
import { useContract, useContractRead } from "@thirdweb-dev/react";

type Props = {};

export default function VotingPage({}: Props) {
  const router = useRouter();
  // Grab the path / [id] field from the URL
  const { id } = router.query;

  const { contract } = useContract("0x3A3aB8A753d8E490b02941d7Dc86C04Aa392E239");
  const { data, isLoading } = useContractRead(contract, "goalIdToGoal", [id])

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

  return (
    <div>
      <div className='py-6'>
        <OracleHero/>
      </div>
    </div>
  );
}
