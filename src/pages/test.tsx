import type { NextPage } from "next";
import type User from "@/types/user";
import Head from "next/head";
import Link from "next/link";

// context
import useGlobalContext from "@/context/globalContext";

const Home: NextPage = () => {
  const { logout, setUser, user } = useGlobalContext();

  const testDeleteAvatar = () => {
    setUser({ ...user, avatar: undefined } as User);
  };

  return (
    <>
      <Head>
        <title>Home | Social</title>
      </Head>
      <div className="mt-28">
        <button
          className="p-4 m-3 border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-200 bg-gray-200 dark:bg-white text-black"
          onClick={logout}
        >
          logout
        </button>
        <Link href="/protected" passHref legacyBehavior={true}>
          <button className="p-4 mr-3 border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-200 bg-gray-200 dark:bg-white text-black">
            protected page
          </button>
        </Link>
        <Link href="/unprotected" passHref legacyBehavior={true}>
          <button className="p-4 mr-3 border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-200 bg-gray-200 dark:bg-white text-black">
            unprotected page
          </button>
        </Link>
        <button
          className="p-4 mr-3 border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-200 bg-gray-200 dark:bg-white text-black"
          onClick={testDeleteAvatar}
        >
          Test Delete Avatar
        </button>
      </div>
    </>
  );
};

export default Home;
