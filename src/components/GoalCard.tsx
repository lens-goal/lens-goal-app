
import { MediaRenderer } from "@thirdweb-dev/react";
import Link from "next/link";
import React from "react";
import { BigNumberMetaData } from "../types/types";
import { parseDateFromBigNumber } from "../utils/parseDateFromBigNumber";

type Props = {
  profile: any;
  description: string;
  deadline: BigNumberMetaData;
  id: string
}

export default function GoalCard({profile, description, deadline, id}: Props) {

  return (
      <div className='flex p-8 bg-white rounded-2xl border-4 border-black'>
        <div className="w-1/4">
          <div className="flex justify-center">
            <MediaRenderer
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
            
            <p>{parseDateFromBigNumber(deadline)}</p>
          </div>
          <div>
          <Link
          href={`/voting/${id}`}
        >
          Vote
        </Link>
          </div>
        </div>
      </div>
  );
}
