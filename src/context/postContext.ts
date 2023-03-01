import {
  createContext,
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useContext,
} from "react";

// types
import type Og from "@/types/og";
import type Post from "@/types/post";
import type UrlCache from "@/types/urlCache";

export type PostContext = {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
  recipient_id?: string;
  initialLoad: boolean;
  setInitialLoad: Dispatch<SetStateAction<boolean>>;
  loadingOg: boolean;
  setLoadingOg: Dispatch<SetStateAction<boolean>>;
  ogStack: Array<Og>;
  setOgStack: Dispatch<SetStateAction<Array<Og>>>;
  processUrl: (url: string) => void;
  postStyle: "mobile" | "desktop";
  image: Blob | undefined;
  loadImage: (e: unknown) => void;
  loadingImage: boolean;
  errorLoadingImage: boolean;
  setErrorLoadingImage: Dispatch<SetStateAction<boolean>>;
  removeImage: () => void;
  imageInputRef: RefObject<HTMLInputElement>;
  urlCacheRef: MutableRefObject<UrlCache>;
  submitPost: () => void;
};

export const postContext = createContext<PostContext>({
  post: { content: "", og: undefined, recipient_id: undefined },
  setPost: () => {},
  recipient_id: undefined,
  initialLoad: true,
  setInitialLoad: () => {},
  loadingOg: false,
  setLoadingOg: () => {},
  ogStack: [],
  setOgStack: () => {},
  processUrl: () => {},
  postStyle: "mobile",
  image: undefined,
  loadImage: () => {},
  loadingImage: false,
  errorLoadingImage: false,
  setErrorLoadingImage: () => {},
  removeImage: () => {},
  imageInputRef: { current: null },
  urlCacheRef: { current: {} },
  submitPost: () => {},
});

const usePostContext = () => useContext(postContext);

export default usePostContext;
