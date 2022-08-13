import type { NextPage } from "next";
import type { GlobalContext } from "../context/globalContext";
import Link from "next/link";
// import Head from "next/head";

// context
import { useGlobalContext } from "../context/globalContext";

const Home: NextPage = () => {
  const { logout }: GlobalContext = useGlobalContext();

  return (
    <>
      <button
        className="p-4 m-3 border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-200 bg-gray-200 dark:bg-white text-black"
        onClick={logout}
      >
        logout
      </button>
      <Link href="/protected">
        <button className="p-4 mr-3 border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-200 bg-gray-200 dark:bg-white text-black">
          protected page
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
