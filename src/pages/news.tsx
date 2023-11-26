import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
// import Link from "next/link";

// components
import Contacts from "@/components/Contacts";

// context
import useGlobalContext from "@/context/globalContext";
import NewsFeed from "@/components/NewsFeed";

const News: NextPage = () => {
  const { logout, setUser, user, darkMode } = useGlobalContext();

  const router = useRouter();

  useEffect(() => {
    const mainContainer = document.getElementById("__next");
    const firstChild = mainContainer?.firstChild;
    (firstChild as any).scrollTo(0, 0);
  }, [router.asPath, user?._id]);

  return (
    <>
      <Head>
        <title>News | Social</title>
      </Head>
      <style jsx>{`
        .contacts {
          height: calc(100vh - 7rem);
        }
        .news-container {
          margin-left: 1rem;
          margin-right: 2rem;
        }
        .news-container > div {
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 1100px) {
          .min-h-\[105vh\] {
            padding-left: 26px;
          }
          .news-container {
            flex: 3.48;
            margin-left: 0;
            margin-right: 0;
          }
          .news-container > div {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        @media (max-width: 900px) {
          .min-h-\[105vh\] {
            padding-left: 16px;
          }
          .contacts {
            display: none;
          }
          .news-container {
            margin-left: 1rem;
            margin-right: 1rem;
          }
          .news-container > div {
            width: 100%;
            // margin-left: 0;
            // margin-right: 0;
          }
        }
        @media (max-width: 550px) {
          .min-h-\[105vh\] {
            padding-left: 0px;
          }
        }
      `}</style>
      <div className="absolute flex flex-col sm:flex-row top-0 pt-20 sm:pt-28 w-full min-h-[105vh]">
        {/* ****************************************************************** */}
        <div className="block sm:hidden w-full h-[25vh] min-h-[200px] bg-white/10 relative cursor-grab">
          <div className="absolute top-2 right-2 rounded-full w-12 h-6 bg-black/10 border border-white/25 flex justify-center items-center text-[.6rem] text-white/75">
            1/5
          </div>
        </div>
        {/* ****************************************************************** */}
        <div className="flex-1 lg:flex-none lg:w-[692px] pb-10 h-full news-container">
          <div>
            {/* ****************************************************************** */}
            <div className="hidden sm:block">
              <div className="w-full h-48 sm:h-56 flex flex-row-reverse bg-white/10 hover:bg-white/20 transition-colors ease-out rounded-lg overflow-hidden group cursor-pointer">
                <div className="h-full w-[39.15%] bg-neutral-600 p-2 group-hover:text-purple-500 text-xl">
                  text
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <div className="flex-1 flex flex-col group cursor-pointer">
                  <div className="h-16 sm:h-20 lg:h-24 bg-white/10 group-hover:bg-white/20 transition-colors ease-out rounded-lg" />
                  <div className="mt-2 group-hover:text-purple-500">text</div>
                </div>
                <div className="flex-1 flex flex-col group cursor-pointer">
                  <div className="h-16 sm:h-20 lg:h-24 bg-white/10 group-hover:bg-white/20 transition-colors ease-out rounded-lg" />
                  <div className="mt-2 group-hover:text-purple-500">text</div>
                </div>
                <div className="flex-1 flex flex-col group cursor-pointer">
                  <div className="h-16 sm:h-20 lg:h-24 bg-white/10 group-hover:bg-white/20 transition-colors ease-out rounded-lg" />
                  <div className="mt-2 group-hover:text-purple-500">text</div>
                </div>
                <div className="flex-1 flex flex-col group cursor-pointer">
                  <div className="h-16 sm:h-20 lg:h-24 bg-white/10 group-hover:bg-white/20 transition-colors ease-out rounded-lg" />
                  <div className="mt-2 group-hover:text-purple-500">text</div>
                </div>
                <div className="flex-1 flex flex-col group cursor-pointer">
                  <div className="h-16 sm:h-20 lg:h-24 bg-white/10 group-hover:bg-white/20 transition-colors ease-out rounded-lg" />
                  <div className="mt-2 group-hover:text-purple-500">text</div>
                </div>
              </div>
            </div>
            {/* ****************************************************************** */}
            <div className="mt-4 sm:mt-7 flex text-xs">
              <div className="w-2 h-4 bg-purple-600 mr-2" />
              <div>For You</div>
            </div>
            <div className="flex flex-col mt-4 sm:mt-7 gap-5">
              <div className="flex group cursor-pointer">
                <div className="h-24 w-48 sm:h-36 sm:w-96 bg-white/10 group-hover:bg-white/20 transition-colors ease-out rounded sm:rounded-lg" />
                <div className="ml-3 w-full group-hover:text-purple-500">
                  text
                </div>
              </div>
              <div className="flex group cursor-pointer">
                <div className="h-24 w-48 sm:h-36 sm:w-96 bg-white/10 group-hover:bg-white/20 transition-colors ease-out rounded sm:rounded-lg" />
                <div className="ml-3 w-full group-hover:text-purple-500">
                  text
                </div>
              </div>
              <div className="flex group cursor-pointer">
                <div className="h-24 w-48 sm:h-36 sm:w-96 bg-white/10 group-hover:bg-white/20 transition-colors ease-out rounded sm:rounded-lg" />
                <div className="ml-3 w-full group-hover:text-purple-500">
                  text
                </div>
              </div>
              <div className="flex group cursor-pointer">
                <div className="h-24 w-48 sm:h-36 sm:w-96 bg-white/10 group-hover:bg-white/20 transition-colors ease-out rounded sm:rounded-lg" />
                <div className="ml-3 w-full group-hover:text-purple-500">
                  text
                </div>
              </div>
              <div className="flex group cursor-pointer">
                <div className="h-24 w-48 sm:h-36 sm:w-96 bg-white/10 group-hover:bg-white/20 transition-colors ease-out rounded sm:rounded-lg" />
                <div className="ml-3 w-full group-hover:text-purple-500">
                  text
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contacts w-[266px] flex-none lg:flex-1 sticky top-28 select-none mr-2.5 flex">
          <Contacts />
        </div>
      </div>
    </>
  );
};

export default News;
