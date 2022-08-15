import Head from "next/head";
import Link from "next/link";

// context
import { useGlobalContext } from "../context/globalContext";

const Unprotected = () => {
  const { mobile } = useGlobalContext();

  return (
    <>
      <Head>
        <title>Unprotected Page | Social</title>
      </Head>
      <Link href="/">
        <button className="p-4 m-3 border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-200 bg-gray-200 dark:bg-white text-black">
          home page
        </button>
      </Link>
      <Link href="/protected">
        <button className="p-4 border border-light-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-200 bg-gray-200 dark:bg-white text-black">
          protected
        </button>
      </Link>
    </>
  );
};

export default Unprotected;
