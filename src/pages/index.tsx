import Image from "next/image";
import Link from "next/link";
import {
  PublicationSortCriteria,
  useExplorePublicationsQuery,
} from "../graphql/generated";

export default function Home() {
  const { isLoading, error, data } = useExplorePublicationsQuery(
    {
      request: {
        sortCriteria: PublicationSortCriteria.Latest,
      },
    },
    {
      // Don't refetch the user comes back
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  console.log(data);

  if (error) {
    return <div>Error...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <div className="flex align-middle">
          <div className="w-1/2">
            <Image
              width={650}
              height={650}
              src="/heroimageLensGoal.png"
              alt=""
            ></Image>
          </div>
          <div className="flex flex-col justify-center w-1/2 text-center">
            <h1 className="text-6xl mb-4">
              Put your money
              <br></br>
              where your goal is!
            </h1>
            <span className="text-lg">
              Socially accountable goals, powered by your frens
            </span>
            <div className="mt-8">
              <Link
                href="/goals/new-goal"
                className="bg-emerald-900 px-20 py-4 text-white rounded-lg"
              >
                Set your goal
              </Link>
            </div>
          </div>
        </div>
        <div className="relative">
          <div
            className="flex"
            style={{ backgroundColor: "#ABFE2C", height: 900 }}
          >
            <h2 className="text-7xl mt-96 ml-20">Incentivise Your Future</h2>
          </div>
          <div style={{ height: 900 }}>
            <h2 className="text-7xl mt-96 ml-80">
              Make Your First Step Empower The Last
            </h2>
          </div>
          <div style={{ backgroundColor: "#ABFE2C", height: 750 }}></div>
          <div className="absolute -top-10 left-0">
            <Image
              width={1850}
              height={2953}
              src="/dottedLine.svg"
              alt=""
            ></Image>
          </div>
        </div>
      </div>
    </div>
  );
}
