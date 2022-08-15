import { useState, useCallback } from "react";
import type { NextPage } from "next";
import Cookie from "js-cookie";
import Head from "next/head";
import Link from "next/link";

// utils
import processService from "../utils/processService";

const Signup: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const register = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      const res = await processService("register", {
        username,
        email,
        password,
      });
      const { token, error } = res;
      if (token) {
        Cookie.set("token", token, { expires: 1 });
        window.location.href = `${window.location.origin}`;
      } else alert(error);
      setLoading(false);
    },
    [username, email, password]
  );

  return (
    <>
      <Head>
        <title>Signup | Social</title>
      </Head>
      {loading ? (
        <div className="w-full text-center">
          <div className="text-black dark:text-white">loading</div>
        </div>
      ) : (
        <div className="mt-32 flex flex-col items-center">
          <form
            onSubmit={register}
            className="w-52 text-sm sm:w-72 sm:text-base"
          >
            <div className="flex flex-col items-center">
              <div className="border border-light-border dark:border-dark-border shadow-lg w-full flex rounded overflow-hidden">
                <div className="py-2 w-12 flex justify-center items-center bg-light-secondary dark:bg-dark-secondary">
                  <i className="text-xs fa-solid fa-user dark:text-gray-500" />
                </div>
                <input
                  className="w-full px-2 py-2 focus:outline-none bg-light-form dark:text-gray-200 dark:bg-dark-form"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  required={true}
                />
              </div>
              <div className="border border-light-border dark:border-dark-border shadow-lg mt-3 w-full flex rounded overflow-hidden">
                <div className="py-2 w-12 flex justify-center items-center bg-light-secondary dark:bg-dark-secondary">
                  <i className="text-xs fa-solid fa-envelope dark:text-gray-500" />
                </div>
                <input
                  className="w-full px-2 py-2 focus:outline-none bg-light-form dark:text-gray-200 dark:bg-dark-form"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={true}
                  autoComplete="email"
                />
              </div>
              {/*  */}
              <div className="border border-light-border dark:border-dark-border shadow-lg mt-3 w-full flex rounded overflow-hidden">
                <div className="py-2 w-12 flex justify-center items-center bg-light-secondary dark:bg-dark-secondary">
                  <i className="text-xs fa-solid fa-lock dark:text-gray-500" />
                </div>
                <input
                  className="w-full px-2 py-2 focus:outline-none bg-light-form dark:text-gray-200 dark:bg-dark-form"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                  minLength={6}
                  autoComplete="current-password"
                />
              </div>
              <div className="border border-light-border dark:border-dark-border shadow-lg mt-3 w-full flex rounded overflow-hidden">
                <div className="py-2 w-12 flex justify-center items-center bg-light-secondary dark:bg-dark-secondary">
                  <i className="text-xs fa-solid fa-lock dark:text-gray-500" />
                </div>
                <input
                  className="w-full px-2 py-2 focus:outline-none bg-light-form dark:text-gray-200 dark:bg-dark-form"
                  type="password"
                  placeholder="Confirm Password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  minLength={6}
                  required={true}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className="mt-3 flex text-[.6rem] sm:text-xs">
              <Link href="/login">
                <input
                  className="border border-black shadow-lg flex-1 text-center py-1.5 sm:px-4 sm:py-3 bg-black dark:bg-black/75 hover:bg-black/80 dark:hover:bg-black text-white rounded cursor-pointer"
                  type="button"
                  value="SIGN IN"
                />
              </Link>
              <div className="flex-[.1]" />
              <input
                className="flex-1 text-center sm:px-4 sm:py-3 bg-blue-500 hover:bg-blue-400 dark:bg-pink-500 dark:hover:bg-pink-400 text-white rounded cursor-pointer"
                type="submit"
                value="REGISTER"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Signup;
