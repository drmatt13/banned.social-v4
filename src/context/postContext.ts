import { createContext, Dispatch, SetStateAction, useContext } from "react";

// types
import type Og from "@/types/og";
import type Post from "@/types/post";
import type User from "@/types/user";
import type UrlCache from "@/types/UrlCache";

export type PostContext = {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
  recipient?: User;
  initialLoad: boolean;
  setInitialLoad: Dispatch<SetStateAction<boolean>>;
  loadingOg: boolean;
  setLoadingOg: Dispatch<SetStateAction<boolean>>;
  // urlCache: UrlCache;
  // setUrlCache: Dispatch<SetStateAction<UrlCache>>;
  ogStack: Array<Og>;
  setOgStack: Dispatch<SetStateAction<Array<Og>>>;
  image: string | undefined;
  setImage: Dispatch<SetStateAction<string | undefined>>;
  processUrl: (url: string) => void;
};

export const postContext = createContext<PostContext>({
  post: { content: "", og: undefined, recipient: undefined },
  setPost: () => {},
  recipient: undefined,
  initialLoad: true,
  setInitialLoad: () => {},
  loadingOg: false,
  setLoadingOg: () => {},
  // urlCache: {},
  // setUrlCache: () => {},
  ogStack: [],
  setOgStack: () => {},
  image: undefined,
  setImage: () => {},
  processUrl: () => {},
});

const usePostContext = () => useContext(postContext);

export default usePostContext;
