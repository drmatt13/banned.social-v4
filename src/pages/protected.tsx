import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

// context
import { useGlobalContext } from "../context/globalContext";

const Home: NextPage = () => {
  const { user } = useGlobalContext();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <Head>
        <title>Protected Page | Social</title>
      </Head>
      <Link href="/">
        <button className="p-4 m-3 border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-200 bg-gray-200 dark:bg-white text-black">
          home page
        </button>
      </Link>
      <Link href="/unprotected">
        <button className="p-4 mr-3 border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-200 bg-gray-200 dark:bg-white text-black">
          unprotected page
        </button>
      </Link>
    </>
  );
};

export default Home;
