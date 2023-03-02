/* eslint-disable @next/next/no-img-element */
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

// components
import NewsFeed from "@/components/NewsFeed";
import PostButton from "@/components/PostButton";

// context
import useGlobalContext from "@/context/globalContext";

// data
import avatarList from "@/data/avatarList";

// hooks
import useUser from "@/hooks/useUser";

const UserProfile = () => {
  const { feedCache } = useGlobalContext();

  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useUser({ _id: (id as string) || undefined });

  useEffect(() => {
    // whenever the router.query.id changes, rerender only this component
    // if (!id) return;
    // router.replace(router.asPath);
    console.log(user);
    // console.log(id);
  }, [user]);

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
          {loading || !id ? (
            <>loading</>
          ) : (
            <div>
              <div className="w-full flex flex-col items-center select-none">
                <div className="mb-5 h-40 w-40 rounded-full border-4 border-blue-500 dark:border-dark-secondary cursor-pointer overflow-hidden">
                  <img
                    className="h-full w-full hover:brightness-[98%] select-none object-cover"
                    src={
                      avatarList[feedCache[id as string]?.avatar!]
                        ? `data:image/jpg;base64, ${
                            avatarList[feedCache[id as string]?.avatar!]
                          }`
                        : feedCache[id as string]?.avatar!
                    }
                    alt={feedCache[id as string]?.avatar!}
                    loading="lazy"
                    // onClick={() => router.push(`/${id}`)}
                  />
                </div>
                <div className="text-xl font-bold mb-5">
                  {feedCache[id as string]?.username!}
                </div>
                <div className="flex w-full max-w-[90vw] mb-5 text-[.7rem] sm:text-sm text-white">
                  <div className="cursor-pointer bg-blue-500 dark:bg-dark-secondary hover:bg-blue-600 dark:hover:bg-dark-form flex-1 flex justify-center items-center rounded transition-colors ease-out py-2 mr-2">
                    Add Friend
                  </div>
                  <div className="cursor-pointer bg-blue-500 dark:bg-dark-secondary hover:bg-blue-600 dark:hover:bg-dark-form flex-1 flex justify-center items-center rounded transition-colors ease-out py-2 mr-2">
                    Message
                  </div>
                  <div className="cursor-pointer bg-blue-500 dark:bg-dark-secondary hover:bg-blue-600 dark:hover:bg-dark-form flex-1 flex justify-center items-center rounded transition-colors ease-out py-2 mr-2">
                    Report Profile
                  </div>
                  <div className="cursor-pointer bg-blue-500 dark:bg-dark-secondary hover:bg-blue-600 dark:hover:bg-dark-form flex-1 flex justify-center items-center rounded transition-colors ease-out">
                    Block
                  </div>
                </div>
              </div>
              <PostButton recipient_id={id as string} />
              <NewsFeed type="user" recipient_id={id as string} />
            </div>
          )}
        </div>
        <div className="select-none container-3 w-[266px] flex-none lg:flex-1 sticky top-28 border-l border-black/20 dark:border-white/25 opacity-50 text-center bg-black/5 dark:bg-white/5">
          container-3
        </div>
      </div>
    </>
  );
};

export default UserProfile;
