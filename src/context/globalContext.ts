import { createContext, useContext } from "react";
import type User from "../types/user";

export type GlobalContext = {
  modal: undefined | "update avatar" | "create post" | "update post";
  setModal: (
    modal: undefined | "update avatar" | "create post" | "update post"
  ) => void;
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
};

export const globalContext = createContext<GlobalContext>({
  modal: undefined,
  setModal: () => {},
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
});

export const useGlobalContext = () => useContext(globalContext);

export default globalContext;
