import { createContext, useContext } from "react";
import type User from "../types/user";

type GlobalContext = {
  modal: "" | "update avatar" | "create post" | "update post";
  setModal: (
    modal: "" | "update avatar" | "create post" | "update post"
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
};

const globalContext = createContext<GlobalContext>({
  modal: "",
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
});

export const useGlobalContext = () => useContext(globalContext);

export default globalContext;
