import { createContext, useContext } from "react";
import type User from "../types/user";
import type FeedCache from "../types/feedCache";

type GlobalContext = {
  mobile: boolean | undefined;
  user: User;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;
  setUser: (user: User) => void;
  logout: (
    href?: string | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  loggingOut: boolean;
  setLoggingOut: (loggingOut: boolean) => void;
  navContainerVisable: boolean;
  setNavContainerVisable: (navVisable: boolean) => void;
  navButtonsVisable: boolean;
  setNavButtonsVisable: (navVisable: boolean) => void;
  feedCache: FeedCache;
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
});

const useGlobalContext = () => useContext(globalContext);

export default useGlobalContext;
