/* eslint-disable @next/next/no-img-element */

import { useEffect } from "react";

// components
import Loading from "@/components/Loading";

// context
import useGlobalContext from "@/context/globalContext";
import usePostContext from "@/context/postContext";

function removeLastIndex(arr: any[]): any[] {
  if (arr.length > 1) {
    return arr.slice(0, -1);
  } else {
    return [];
  }
}

const OgContent = () => {
  const { mobile } = useGlobalContext();
  const { post, loadingOg, ogStack, setOgStack, postStyle } = usePostContext();

  return (
    <>
      {loadingOg && ogStack.length === 0 && (
        <div className="relative px-2 mb-3 h-24 w-full">
          <Loading />
        </div>
      )}
      {ogStack.length !== 0 &&
        (post.og?.siteName ||
          post.og?.title ||
          post.og?.description ||
          post.og?.url) && (
          <div className="relative px-2 mb-3 select-none">
            <div
              className={`${
                mobile
                  ? "active:bg-red-400 dark:active:bg-white"
                  : "hover:bg-red-400 dark:hover:bg-white"
              } ${
                postStyle === "desktop"
                  ? "dark:border-neutral-400 dark:hover:border-black/40 border-black/25 bg-white dark:bg-neutral-100 right-0.5"
                  : "bg-white dark:bg-neutral-300 right-1"
              } border border-neutral-400 hover:border-none dark:hover:border-solid absolute h-5 w-5 -top-2 rounded-full p-2 flex justify-center items-center cursor-pointer pointer-events-auto transition-colors ease-out`}
              onClick={() => setOgStack(removeLastIndex(ogStack))}
            >
              <i className="fas fa-times text-xs text-gray-800 dark:text-black/90 w-5 h-5 flex justify-center items-center" />
            </div>
            <div
              className={`${
                postStyle === "mobile"
                  ? `${
                      mobile
                        ? "active:bg-gray-200/75 dark:active:bg-neutral-100/[15%]"
                        : "hover:bg-gray-200/75 dark:hover:bg-neutral-100/[15%]"
                    } bg-gray-100/50 dark:bg-neutral-100/10 dark:border-black/40 shadow`
                  : `${
                      mobile
                        ? "active:bg-gray-400/20 dark:active:bg-white/60"
                        : "hover:bg-gray-400/20 dark:hover:bg-white/60"
                    } bg-neutral-200/50 dark:bg-white/40 dark:border-black/[17.5%]`
              } p-2 flex border border-black/[17.5%] w-full h-full rounded cursor-default select-none transition-colors ease-out`}
            >
              {post.og.image?.url && (
                <img
                  className="mr-2.5 shadow h-9 aspect-video object-cover rounded-sm"
                  src={post.og.image.url}
                  alt={post.og.title || post.og.title || "og image"}
                />
              )}
              <div
                className="flex flex-col flex-1 justify-start overflow-hidden"
                style={{
                  fontSize: "0.8rem",
                  lineHeight: "1rem",
                }}
              >
                {post.og.siteName && (
                  <div className="h-[1.125rem] truncate">
                    {post.og.siteName}
                  </div>
                )}
                {post.og.title && (
                  <div className="h-[1.125rem] font-bold truncate">
                    {post.og.title}
                  </div>
                )}
                {post.og.description && (
                  <div className="h-[1.125rem] truncate">
                    {post.og.description}
                  </div>
                )}
                {post.og.url && !post.og.siteName && (
                  <div className="h-[1.125rem] truncate">
                    {decodeURI(post.og.url || "")}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default OgContent;
