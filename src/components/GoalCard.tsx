
import { MediaRenderer } from "@thirdweb-dev/react";
import React from "react";

type Props = {
  profile: any;
  description: string;
  deadline: number
}

export default function GoalCard({profile, description = 'Not defined', deadline=123}: Props) {
  // const myStyle = {
  //   borderRadius: 'red',
  //   fontSize: '24px',
  //   fontWeight: 'bold',
  // };
  return (
      <div className='flex p-8 bg-white rounded-2xl border-4 border-black'>
        <div className="w-1/4">
          <div className="flex justify-center">
            <MediaRenderer
          // @ts-ignore
          // height="100px"
          // width="200px"
          className="rounded-full"
          src={profile.picture.original.url || ""}
              alt={
                profile.name || profile?.handle || ""
              }></MediaRenderer>
          </div>
        </div>
        <div className="flex flex-col justify-between w-3/4">
          <div className="text-xl">{profile.handle}</div>
          <div>
            <h3 className="text-xl">Description:</h3>
            <p>{description}</p>
          </div>
          <div>
            <h3 className="text-xl">Deadline:</h3>
            <p>{deadline}</p>
          </div>
        </div>
      </div>
  );
}
