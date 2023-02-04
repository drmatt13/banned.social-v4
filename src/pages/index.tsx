import type { NextPage } from "next";
import { useState } from "react";
import type User from "@/types/user";
import Head from "next/head";
// import Link from "next/link";

// context
import { useGlobalContext, GlobalContext } from "@/context/globalContext";

const Home: NextPage = () => {
  const { logout, setUser, user }: GlobalContext = useGlobalContext();

  return (
    <>
      <Head>
        <title>Home | Social</title>
      </Head>
      <div className="h-[200vh]">
        <div>POST BUTTON</div>
        <div>FEED</div>
      </div>
    </>
  );
};

export default Home;
