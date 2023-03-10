import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { SessionProvider, signOut } from "next-auth/react";
import Cookie from "js-cookie";
import Head from "next/head";

// components
import AppLayout from "@/layouts/AppLayout";

// global context
import { globalContext } from "@/context/globalContext";

// global styles
import "@/styles/globals.scss";

// libraries
import processService from "@/lib/processService";

// types
import type { AppType } from "next/dist/shared/lib/utils";
import type { Session } from "next-auth";
import type User from "@/types/user";
import type FeedCache from "@/types/feedCache";

const MyApp: AppType<{
  session: Session;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const router = useRouter();
  const [user, setUser] = useState<User>(undefined);
  const [darkMode, setDarkMode] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [navContainerVisable, setNavContainerVisable] = useState(true);
  const [navButtonsVisable, setNavButtonsVisable] = useState(false);
  const [feedCache, setFeedCache] = useState<FeedCache>({});

  // useEffect(() => {
  //   console.log("testapp");
  // }, []);

  const updateFeedCache = useCallback(async (users: string[]) => {
    const data = await processService("update feed cache", {
      users,
    });
    if (!data.users) return;
    // transform data.users into an object with the user id as the key
    let newFeedCache: FeedCache = {};
    for (const key in data.users) {
      if (data.users[key]?._id) {
        newFeedCache[data.users[key]!._id] = {
          username: data.users[key]!.username,
          avatar: data.users[key]!.avatar,
        };
      }
      // console.log({ ...feedCache, ...newFeedCache });
      setFeedCache((prev) => ({ ...prev, ...newFeedCache }));
    }
  }, []);

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
    window.location.replace(`${window.location.origin}/login`);
  };

  const route = router.pathname.split("/")[1] || "/";

  return !["login", "signup"].includes(route) && !user ? (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
            navContainerVisable,
            setNavContainerVisable,
            navButtonsVisable,
            setNavButtonsVisable,
            feedCache,
            setFeedCache,
            updateFeedCache,
          }}
        >
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </globalContext.Provider>
      </SessionProvider>
    </>
  ) : (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
          navContainerVisable,
          setNavContainerVisable,
          navButtonsVisable,
          setNavButtonsVisable,
          feedCache,
          setFeedCache,
          updateFeedCache,
        }}
      >
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </globalContext.Provider>
    </>
  );
};

export default MyApp;
