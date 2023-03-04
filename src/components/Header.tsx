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
          <Link href="/goals/new-goal">My Goals</Link>
          <Link href="/goals/friends-goals">Frens' Goals</Link>
          <Link href="/goals/group-goals">Group Goals</Link>
          <Link href="/Evidence">Evidence</Link>
        </div>

        <div className={styles.right}>
          <SignInButton />
        </div>
      </div>
      <div style={{ height: 64 }} />
    </>
  );
}
