import { Web3Button } from "@thirdweb-dev/react";
import Link from "next/link";
import React from "react";
import styles from "../styles/Header.module.css";
import SignInButton from "./SignInButton";

export default function Header() {
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.left}>
          <Link href="/goals/new-goal">New Goal</Link>
          <Link href={"/"}>
            <img src="/logo.png" alt="logo" className={styles.logo} />
          </Link>

          <Link href={"/create"}>Create</Link>
        </div>

        <div className={styles.right}>
        <Web3Button
      contractAddress="0x99dD2B1A97683e43eE43f22025AFD9c4Ff84Afed"
      action={async (contract) => {
       console.log(await contract.call("getData"))
      }}
    >
      Call
    </Web3Button>
          <SignInButton />
        </div>
      </div>
      <div style={{ height: 64 }} />
    </>
  );
}
