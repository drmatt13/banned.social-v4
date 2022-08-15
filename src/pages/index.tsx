import type { NextPage } from "next";
import type { GlobalContext } from "../context/globalContext";
import Head from "next/head";
import Link from "next/link";

// context
import { useGlobalContext } from "../context/globalContext";

const Home: NextPage = () => {
  const { logout }: GlobalContext = useGlobalContext();

  return (
    <>
      <Head>
        <title>Home | Social</title>
      </Head>
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

// export async function getServerSideProps(context) {
//   return {
//     props: {}, // will be passed to the page component as props
//   }
// }

export default Home;
