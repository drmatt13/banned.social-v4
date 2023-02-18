/* eslint-disable @next/next/no-img-element */
import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import _ from "lodash";

// context
import useGlobalContext from "@/context/globalContext";
import { modalContext } from "@/context/modalContext";
import { postContext } from "@/context/postContext";

// data
import avatarList from "@/data/avatarList";

// modal
import PostModal from "@/modals/PostModal";

// types
import type Og from "@/types/og";
import type User from "@/types/user";
import type Post from "@/types/post";
import type UrlCache from "@/types/UrlCache";

// libaries
import processService from "@/lib/processService";

interface Props {
  recipient?: User;
}

function checkOverlap(
  str1: string | undefined,
  str2: string | undefined
): boolean {
  if (str1 === str2) {
    return true;
  }
  if (!str1 || !str2) {
    return false;
  }
  const minLength = Math.min(str1.length, str2.length);
  for (let i = 0; i < minLength; i++) {
    if (str1.charAt(i) !== str2.charAt(i)) {
      return false;
    }
  }
  return true;
}

function checkOgEquality(og1: Og, og2: Og): boolean {
  if (!checkOverlap(og1.url, og2.url!)) {
    return false;
  }
  og1.url = og2.url;
  return _.isEqual(og1, og2);
}

const PostButton = ({ recipient }: Props) => {
  const { user } = useGlobalContext();
  const [post, setPost] = useState<Post>({
    content: "",
    recipient,
    og: undefined,
  });
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingOg, setLoadingOg] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [urlsProcessing, setUrlsProcessing] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const urlCacheRef = useRef<UrlCache>({}); // not context
  const [ogStack, setOgStack] = useState<Array<Og>>([]); // will get added to context

  useEffect(() => {
    if (ogStack.length === 0) {
      setPost((p) => ({ ...p, og: undefined }));
    } else {
      setPost((p) => ({ ...p, og: ogStack[ogStack.length - 1] }));
    }
  }, [ogStack]);

  const adjustStack = useCallback(
    (url: string) => {
      // if url is not in cache, return
      if (!urlCacheRef.current[url]) {
        return setUrlsProcessing((u) => u - 1);
      }
      // if the stack is empty, add the url to the stack and set isStack to true
      if (ogStack.length === 0) {
        urlCacheRef.current[url]!.inStack = true;
        setOgStack([urlCacheRef.current[url]!.og]);
        return setUrlsProcessing((u) => u - 1);
      }
      let index = ogStack.length - 1;
      //check to see if an object with the same og data is already in the stack
      while (index >= 0) {
        if (checkOgEquality(ogStack[index]!, urlCacheRef.current[url]?.og!)) {
          break;
        }
        index--;
      }
      // if the url is not in the stack, add it to the stack and set isStack to true
      if (index === -1) {
        urlCacheRef.current[url]!.inStack = true;
        setOgStack([...ogStack, urlCacheRef.current[url]!.og]);
        return setUrlsProcessing((u) => u - 1);
      }
      // if the url is already in the stack, remove all urls after it and set isStack to false for all of them
      const newStack = ogStack.slice(0, index + 1);
      const newCache = { ...urlCacheRef.current };
      for (let i = index + 1; i < ogStack.length; i++) {
        const og = ogStack[i];
        const url = Object.keys(newCache).find((u) => {
          return checkOgEquality(newCache[u]?.og!, og!);
        });
        if (url) {
          newCache[url]!.inStack = false;
        }
      }
      setOgStack(newStack);
      urlCacheRef.current = newCache;
      setUrlsProcessing((u) => u - 1);
    },
    [ogStack]
  );

  const getOgData = useCallback(
    async (url: string) => {
      setUrlsProcessing((u) => u + 1);
      if (urlCacheRef.current[url]) {
        adjustStack(url);
        return;
      }
      try {
        const data = await processService("get og", {
          url,
        });
        const { success, error, og } = data;
        if (!success || !og || error) throw new Error(error || "server error");
        urlCacheRef.current = {
          ...urlCacheRef.current,
          [url]: { og, inStack: false },
        };
        adjustStack(url);
      } catch (error) {
        setUrlsProcessing((u) => u - 1);
      }
    },
    [adjustStack]
  );

  const processUrl = useCallback(
    (url: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        getOgData(url);
      }, 750);
    },
    [getOgData]
  );

  useEffect(() => {
    if (urlsProcessing > 0) {
      setLoadingOg(true);
    } else {
      setLoadingOg(false);
    }
  }, [urlsProcessing]);

  const parseHTML = useCallback((html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html.replace(/<[^>]+>/gi, " ");
    return (
      div.textContent?.replace(/\s+/g, " ") ||
      div.innerText.replace(/\s+/g, " ") ||
      ""
    );
  }, []);

  return (
    <>
      {" "}
      <style jsx>{`
    @media (max-width: 535px) {
    .bg-light-secondary {
      border-radius: 0;
    }
  `}</style>
      <modalContext.Provider value={{ modal, setModal, loading, setLoading }}>
        <postContext.Provider
          value={{
            post,
            setPost,
            initialLoad,
            setInitialLoad,
            recipient,
            loadingOg,
            setLoadingOg,
            ogStack,
            setOgStack,
            image,
            setImage,
            processUrl,
          }}
        >
          <PostModal />
        </postContext.Provider>
      </modalContext.Provider>
      <div className="w-full text-sm flex bg-light-secondary dark:bg-dark-secondary rounded-lg px-4 py-3 mb-5 border dark:border-dark-border shadow-sm dark:shadow-dark-border select-none">
        <div className="overflow-hidden mr-3 h-10 w-10 rounded-full ">
          <Link href={`/${user?._id}`}>
            <img
              className="h-full w-full rounded-full border border-light-border dark:border-white/25 cursor-pointer hover:brightness-[98%]"
              src={
                avatarList[user?.avatar!]
                  ? `data:image/jpg;base64, ${avatarList[user?.avatar!]}`
                  : user?.avatar
              }
              alt={user?.avatar}
            />
          </Link>
        </div>
        <div
          onClick={() => setModal(true)}
          className="relative flex-1 h-10 rounded-full bg-light-primary dark:bg-dark-form border dark:border-gray-900/50 hover:bg-stone-200 dark:hover:bg-white/25 cursor-pointer hover:transition-colors hover:duration-200 ease-out group"
        >
          <div className="absolute h-full w-full top-0 left-0 flex items-center text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white hover:transition-colors hover:duration-200 ease-out truncate">
            <div className="truncate ml-4 mr-4">
              {parseHTML(post.content).trim() !== ""
                ? parseHTML(post.content)
                : `What's on your mind, 
            ${
              user!.username[0]?.toUpperCase() + user!.username!.substring(1)
            }?`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostButton;
