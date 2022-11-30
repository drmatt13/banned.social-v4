import type { AppType } from "next/dist/shared/lib/utils";
import type { Session } from "next-auth";
import type User from "@/types/user";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SessionProvider, signOut } from "next-auth/react";
import Cookie from "js-cookie";

// components
import AppLayout from "@/layouts/AppLayout";

// global context
import globalContext from "@/context/globalContext";

// global styles
import "@/styles/globals.scss";

const MyApp: AppType<{
  session: Session;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const router = useRouter();
  const [user, setUser] = useState<User>(undefined);
  const [darkMode, setDarkMode] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDarkMode(false);
    }

    setMobile(
      typeof window !== "undefined"
        ? /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
        : false
    );
  }, []);

  const toggleDarkMode = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDarkMode(true);
    }
  };

  const logout = async (): Promise<void> => {
    setLoggingOut(true);
    Cookie.remove("token");
    Cookie.remove("next-auth.session-token");
    Cookie.remove("next-auth.callback-url");
    Cookie.remove("next-auth.csrf-token");
    signOut({ redirect: false });
    router.reload();
  };

  return (
    <SessionProvider session={session}>
      <globalContext.Provider
        value={{
          mobile,
          user,
          darkMode,
          setDarkMode,
          toggleDarkMode,
          setUser,
          logout,
          loggingOut,
          setLoggingOut,
        }}
      >
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </globalContext.Provider>
    </SessionProvider>
  );
};

export default MyApp;
