import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
// import Link from "next/link";

// components
import NewsFeed from "@/components/NewsFeed";
import PostButton from "@/components/PostButton";

// context
import useGlobalContext from "@/context/globalContext";

const Home: NextPage = () => {
  const { logout, setUser, user } = useGlobalContext();

  const router = useRouter();

  useEffect(() => {
    const mainContainer = document.getElementById("__next");
    const firstChild = mainContainer?.firstChild;
    (firstChild as any).scrollTo(0, 0);
  }, [router.asPath, user?._id]);

  return (
    <>
      <Head>
        <title>Home | Social</title>
      </Head>
      {/* 
        WIDTH SIZES OF FEED
        0px
        400px
        640px
        900px
        1100px
      */}
      <style jsx>{`
        .container-1,
        .container-3 {
          height: calc(100vh - 7rem);
        }
        .container-2 > div {
          width: 75%;
          max-width: 580px;
        }
        @media (max-width: 1100px) {
          .container-1 {
            display: none;
          }
          .container-2 {
            width: 740px;
          }
          .container-2 > div {
            width: 520px;
            max-width: 100%;
          }
        }
        @media (max-width: 900px) {
          .flex {
            justify-content: center;
          }
          .container-2 {
            width: 100%;
            flex: none;
          }
          .container-3 {
            display: none;
          }
        }
      `}</style>
      <div className="absolute flex top-0 pt-20 sm:pt-28 w-full min-h-[105vh]">
        <div className="select-none container-1 flex-1 sticky top-28 border-r border-black/20 dark:border-white/25 opacity-50 text-center bg-black/5 dark:bg-white/5">
          container-1
        </div>
        <div className="container-2 flex-1 h-full lg:flex-none text-center w-[55%] flex justify-center items-start">
          <div>
            <PostButton />
            <NewsFeed type="global" />
          </div>
        </div>
        <div className="select-none container-3 w-[266px] flex-none lg:flex-1 sticky top-28 border-l border-black/20 dark:border-white/25 opacity-50 text-center bg-black/5 dark:bg-white/5">
          container-3
        </div>
      </div>
    </>
  );
};

export default Home;
