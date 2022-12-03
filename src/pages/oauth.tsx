import { useRef, useEffect } from "react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import Head from "next/head";

// components
import Loading from "@/components/Loading";

// context
import { useGlobalContext } from "../context/globalContext";

// utils
import processService from "../lib/processService";

const Login: NextPage = () => {
  const { data: session } = useSession();
  const { setUser, logout } = useGlobalContext();
  const processing = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (processing.current) return;
    const query = router.asPath
      .replace("/oauth?", "")
      .split("&")
      .reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        if (key) acc[key] = value;
        return acc;
      }, {} as any);
    const oAuthLogin = async () => {
      processing.current = true;
      const res = await processService("oauth", {
        provider: query.provider,
      });
      delete query.provider;
      const { user, token, success, error } = res;
      if (success) {
        if (user && token) {
          Cookie.set("token", token, {
            expires: query.expires ? undefined : 3600,
          });
          delete query.expires;
          setUser(user);
          let path = "";
          if (query.path) {
            path = query.path;
          }
          let queryString = "";
          for (const key in query) {
            if (key !== "path") {
              queryString += `${key}=${query[key]}&`;
            }
          }
          if (queryString.endsWith("&")) {
            queryString = queryString.slice(0, -1);
          }
          router.replace(`/${path}${queryString ? "?" : ""}${queryString}`);
        } else {
          logout();
        }
      } else {
        alert(error);
      }
    };
    if (!processing.current) {
      oAuthLogin();
    }
    if (typeof session !== "undefined") {
      if (session !== null) {
        oAuthLogin();
      } else if (session === null) {
        logout();
      }
    }
  }, [processing, session, router, logout, setUser]);

  return (
    <>
      <Head>
        <title>Login | Social</title>
      </Head>
      <Loading />
    </>
  );
};

export default Login;
