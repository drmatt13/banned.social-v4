import React from "react";

const LoadingPosts = () => {
  return (
    <>
      <style jsx>{`
    @media (max-width: 535px) {
    .bg-light-secondary {
      border-radius: 0;
    }
  `}</style>
      <></>
      <div className="relative text-sm bg-light-secondary dark:bg-dark-secondary pt-3 rounded-lg mb-5 w-full border dark:border-dark-border shadow dark:shadow-dark-border overflow-hidden">
        <div className="mx-4 flex items-start mb-2">
          <div className="h-10 w-10 overflow-hidden mr-3 rounded-full bg-black/25 dark:bg-white/30 animate-pulse" />
          <div className="flex-1 flex font-xs font-medium h-10">
            <div className="flex-1 flex flex-col">
              <div className="flex">
                <div className="bg-black/25 dark:bg-white/30 animate-pulse w-48 h-4"></div>
              </div>
              <div className="flex h-full items-center text-xs font-light opacity-75">
                <div className="bg-black/25 dark:bg-white/30 animate-pulse w-32 h-4"></div>
              </div>
            </div>
            <div className="h-full flex justify-center items-center animate-pulse text-black/50 dark:text-white/50">
              <i className="fa-solid fa-ellipsis flex justify-center items-center h-8 w-8 text-lg rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex-col w-full px-5">
          <div className="mb-2 w-full h-4 bg-black/25 dark:bg-white/30 animate-pulse" />
          <div className="mb-2 w-full h-4 bg-black/25 dark:bg-white/30 animate-pulse" />
          <div className="mb-2 w-full h-4 bg-black/25 dark:bg-white/30 animate-pulse" />
          <div className="mb-2 w-full h-4 bg-black/25 dark:bg-white/30 animate-pulse" />
          <div className="mb-2 w-60 h-4 bg-black/25 dark:bg-white/30 animate-pulse" />
        </div>
        <div className="h-10 flex justify-between mx-5 border-b border-black/25 dark:border-white/25 select-none opacity-75">
          <div className="flex items-center">
            {/* xxx likes */}
            <div className="bg-black/25 dark:bg-white/30 animate-pulse w-24 h-4" />
          </div>
          {/* <div></div> */}
          <div className="flex items-center">
            <div className="pr-3">
              <div className="bg-black/25 dark:bg-white/30 animate-pulse w-24 h-4" />
            </div>
            <div>
              <div className="bg-black/25 dark:bg-white/30 animate-pulse w-24 h-4" />
            </div>
          </div>
        </div>
        <div className="h-10 flex justify-evenly mx-3 select-none">
          <div className="m-1 flex-1 flex justify-center items-center animate-pulse text-black/50 dark:text-white/50">
            <i className="fa-solid fa-thumbs-up mr-2" />
            Like
          </div>
          <div className="m-1 flex-1 flex justify-center items-center animate-pulse text-black/50 dark:text-white/50">
            <i className="fa-solid fa-comment mr-2" />
            Comment
          </div>
          <div className="m-1 flex-1 flex justify-center items-center animate-pulse text-black/50 dark:text-white/50">
            <i className="fa-solid fa-share mr-2" />
            Share
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingPosts;
