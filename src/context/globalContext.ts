import { createContext, Dispatch, SetStateAction, useContext } from "react";
import type User from "../types/user";
import type FeedCache from "../types/feedCache";

type GlobalContext = {
  mobile: boolean | undefined;
  user: User;
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
  toggleDarkMode: () => void;
  setUser: Dispatch<SetStateAction<User>>;
  logout: (
    href?: string | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  loggingOut: boolean;
  setLoggingOut: Dispatch<SetStateAction<boolean>>;
  navContainerVisable: boolean;
  setNavContainerVisable: Dispatch<SetStateAction<boolean>>;
  navButtonsVisable: boolean;
  setNavButtonsVisable: Dispatch<SetStateAction<boolean>>;
  feedCache: FeedCache;
  setFeedCache: Dispatch<SetStateAction<FeedCache>>;
  updateFeedCache: (users: string[]) => Promise<void>;
};

export const globalContext = createContext<GlobalContext>({
  mobile: false,
  user: undefined,
  setUser: () => {},
  logout: () => Promise.resolve(),
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
  loggingOut: false,
  setLoggingOut: () => {},
  navContainerVisable: false,
  setNavContainerVisable: () => {},
  navButtonsVisable: false,
  setNavButtonsVisable: () => {},
  feedCache: {},
  setFeedCache: () => {},
  updateFeedCache: () => Promise.resolve(),
});

const useGlobalContext = () => useContext(globalContext);

export default useGlobalContext;
