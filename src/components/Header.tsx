import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";

export default function Header() {
  return (
    <>
      <div className="flex container mx-auto px-8 pt-4">
        <div className="flex grow items-center gap-10">
          <Link href="/goals/new-goal">My Goals</Link>
          <Link href="/goals/friends-goals">Frens Goals</Link>
          <Link href="/goals/group-goals">Group Goals</Link>
          <Link href="/">Home</Link>
        </div>
        <div>
          <SignInButton />
        </div>
      </div>
    </>
  );
}
