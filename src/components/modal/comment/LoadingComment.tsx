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
      <>
        <div
          className={`w-full flex flex-col px-3 pointer-events-none select-none`}
        >
          <div className="flex">
            <div className="w-10 flex flex-col">
              <div
                className={`h-8 w-8 mr-2 overflow-hidden rounded-full bg-black/20 animate-pulse`}
              ></div>
              <div className="flex-1">
                <div className="w-8 h-full flex flex-row-reverse pt-[3px]"></div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div
                className={`bg-neutral-500/20 w-[97.5%] rounded-xl flex flex-col px-2 py-1.5`}
              >
                <div
                  className="w-24 h-4 bg-black/10 animate-pulse mb-1"
                  style={{
                    lineHeight: "1rem",
                  }}
                />
                <div
                  className="w-full h-4 bg-black/10 animate-pulse"
                  style={{
                    lineHeight: "1rem",
                  }}
                />
              </div>
              <div className="h-6 flex text-xs items-center text-black/90 font-semibold pl-4 gap-4">
                <div
                  className="my-1 w-6 h-4 bg-black/20 animate-pulse"
                  style={{
                    lineHeight: "1rem",
                  }}
                />
                <div
                  className="my-1 w-7 h-4 bg-black/20 animate-pulse"
                  style={{
                    lineHeight: "1rem",
                  }}
                />
                <div
                  className="my-1 w-6 h-4 bg-black/20 animate-pulse"
                  style={{
                    lineHeight: "1rem",
                  }}
                />
                {/* <div className="">Reply</div> */}
              </div>
            </div>
          </div>
        </div>
        {/* ******************************************************************************************* */}
      </>
    </>
  );
};

export default LoadingPosts;
