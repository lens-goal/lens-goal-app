import Image from "next/image";
import Link from "next/link";
import FeedPost from "../components/FeedPost";
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  useExplorePublicationsQuery,
} from "../graphql/generated";
import styles from "../styles/Home.module.css";

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
    return <div className={styles.container}>Error...</div>;
  }

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Iterate over the array of items inside the data field  */}
      <div>
        <div className="flex align-middle">
          <div className="w-1/2">
            <Image width={650} height={650} src='/heroimageLensGoal.png' alt=''></Image>  
          </div>
          <div className="flex flex-col justify-center w-1/2 text-center">
            <h1 className="text-6xl mb-4">
              Put your money
              <br></br>
              where your goal is!
            </h1>
            <span className="text-lg">Socially accountable goals, powered by your frens</span>
            <div className="mt-8">
              <Link href="/goals/new-goal" className="bg-emerald-900 px-20 py-4 text-white rounded-lg">
                Set your goal
              </Link>
            </div>
          </div>

        </div>
        <div>
          <Image width={1850} height={2953} src='/dottedLine.svg' alt=''></Image> 
        </div>
      </div>
    </div>
  );
}
