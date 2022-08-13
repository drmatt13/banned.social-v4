import { createContext, useContext } from "react";
import type User from "../types/user";

export type GlobalContext = {
  mobile: boolean | undefined;
  user: User;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;
  setUser: (user: User | {}) => void;
  logout: (
    href?: string | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
};

export const globalContext = createContext<GlobalContext>({
  mobile: false,
  user: {} as User,
  setUser: () => {},
  logout: () => Promise.resolve(),
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
});

export const useGlobalContext = () => useContext(globalContext);

export default globalContext;
