import { useState, useCallback, useRef } from "react";
import type { NextPage } from "next";
import Cookie from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";

// components
import LoginLogo from "@/components/LoginLogo";

// context
import { useGlobalContext } from "@/context/globalContext";

// libaries
import processService from "../lib/processService";

// styles
import darkStatic from "@/styles/darkStatic.module.scss";
import lightStatic from "@/styles/lightStatic.module.scss";

const Signup: NextPage = () => {
  const { darkMode } = useGlobalContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [usernameRing, setUsernameRing] = useState(0);
  const [emailRing, setEmailRing] = useState(0);
  const [passwordRing, setPasswordRing] = useState(0);
  const [password2Ring, setPassword2Ring] = useState(0);

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const password2Ref = useRef<HTMLInputElement>(null);

  const [originalViewportHeight] = useState(window.innerHeight + "px");

  const validateEmail = useCallback((email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }, []);

  const register = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        if (password !== password2) {
          alert("passwords do not match");
          setPasswordRing(1);
          setPassword2Ring(1);
          return;
        }
        e.preventDefault();
        setLoading(true);
        const res = await processService("register", {
          username,
          email,
          password,
        });
        console.log(res);
        const { token, error } = res;
        if (token) {
          Cookie.set("token", token, { expires: 1 });
          window.location.replace(`${window.location.origin}`);
        }
        if (error) {
          if (error === "Username already exists") {
            alert("Username already exists");
            usernameRef.current?.focus();
            setUsernameRing(1);
          } else if (error === "Email already exists") {
            alert("Email already exists");
            emailRef.current?.focus();
            setEmailRing(1);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    [username, email, password, password2]
  );

  return (
    <>
      <Head>
        <title>Signup | Social</title>
      </Head>
      <style global>{`
      ${
        darkMode
          ? `input:-webkit-autofill,
      input:-webkit-autofill:focus {
        border: 1px solid #3b4148;
        -webkit-text-fill-color: rgba(255, 255, 255, 0.9);
        -webkit-box-shadow: 0 0 0px 1000px #3b4148 inset;
        box-shadow: 0 0 0px 1000px #3b4148 inset;
        color: rgba(255, 255, 255, 0.9);
        font-size: auto;
        line-height: auto;
      }`
          : `input:-webkit-autofill,
      input:-webkit-autofill:focus {
        border: 1px solid #ffffff;
        -webkit-text-fill-color: black;
        -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
        box-shadow: 0 0 0px 1000px #ffffff inset;
        color: black;
        font-size: .9rem;
      }`
      } 
      `}</style>
      <div
        className={`${
          darkMode ? darkStatic.container : lightStatic.container
        } flex flex-col items-center`}
        style={{
          height: originalViewportHeight,
        }}
      >
        <LoginLogo />
        <div className="mt-14 md:mt-16 lg:mt-20 flex flex-col items-center z-50 animate-fade-in text-black">
          <form
            onSubmit={register}
            className="w-52 text-sm md:w-72 sm:text-base"
          >
            <div className="flex flex-col items-center">
              <div
                className={`${
                  usernameRing === 1
                    ? "ring-1 ring-red-500 dark:ring-red-500"
                    : ""
                } ${
                  usernameRing === 2 ? "ring-1 ring-green-500" : ""
                } h-10 border border-light-border dark:border-dark-border shadow-lg w-full flex rounded overflow-hidden`}
              >
                <div className="py-2 w-12 flex justify-center items-center bg-light-secondary dark:bg-dark-secondary">
                  <i className="text-xs fa-solid fa-user dark:text-gray-500" />
                </div>
                <input
                  className={`${
                    loading ? "text-gray-400" : "dark:text-gray-200"
                  } w-full px-2 py-2 focus:outline-none bg-light-form dark:bg-dark-form`}
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) =>
                    setUsername((username) => {
                      setUsernameRing(
                        e.target.value.length === 0
                          ? 0
                          : e.target.value.length <= 2
                          ? 1
                          : 2
                      );
                      return e.target.value;
                    })
                  }
                  minLength={3}
                  required={true}
                  ref={usernameRef}
                  disabled={loading}
                />
              </div>
              {/*  */}
              <div
                className={`${
                  emailRing === 1 ? "ring-1 ring-red-500 dark:ring-red-500" : ""
                } ${
                  emailRing === 2 ? "ring-1 ring-green-500" : ""
                } h-10 border border-light-border dark:border-dark-border shadow-lg mt-3 w-full flex rounded overflow-hidden`}
              >
                <div className="py-2 w-12 flex justify-center items-center bg-light-secondary dark:bg-dark-secondary">
                  <i className="text-xs fa-solid fa-envelope dark:text-gray-500" />
                </div>
                <input
                  className={`${
                    loading ? "text-gray-400" : "dark:text-gray-200"
                  } w-full px-2 py-2 focus:outline-none bg-light-form dark:bg-dark-form`}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail((email) => {
                      setEmailRing(
                        e.target.value.length === 0
                          ? 0
                          : validateEmail(e.target.value)
                          ? 2
                          : 1
                      );
                      return e.target.value;
                    })
                  }
                  required={true}
                  autoComplete="email"
                  ref={emailRef}
                  disabled={loading}
                />
              </div>
              {/*  */}
              <div
                className={`${
                  passwordRing === 1
                    ? "ring-1 ring-red-500 dark:ring-red-500"
                    : ""
                } ${
                  passwordRing === 2 ? "ring-1 ring-green-500" : ""
                } h-10 border border-light-border dark:border-dark-border shadow-lg mt-3 w-full flex rounded overflow-hidden`}
              >
                <div className="py-2 w-12 flex justify-center items-center bg-light-secondary dark:bg-dark-secondary">
                  <i className="text-xs fa-solid fa-lock dark:text-gray-500" />
                </div>
                <input
                  className={`${
                    loading ? "text-gray-400" : "dark:text-gray-200"
                  } w-full px-2 py-2 focus:outline-none bg-light-form dark:bg-dark-form`}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword((password) => {
                      setPasswordRing(
                        Number(passwordRef.current?.value.length) === 0
                          ? 0
                          : Number(passwordRef.current?.value.length) < 8
                          ? 1
                          : 2
                      );
                      setPassword2Ring(
                        Number(password2Ref.current?.value.length) === 0
                          ? 0
                          : Number(password2Ref.current?.value.length) < 8
                          ? 1
                          : 2
                      );
                      return e.target.value;
                    })
                  }
                  required={true}
                  minLength={8}
                  autoComplete="current-password"
                  ref={passwordRef}
                  disabled={loading}
                />
              </div>
              {/*  */}
              <div
                className={`${
                  password2Ring === 1
                    ? "ring-1 ring-red-500 dark:ring-red-500"
                    : ""
                } ${
                  password2Ring === 2 ? "ring-1 ring-green-500" : ""
                } h-10 border border-light-border dark:border-dark-border shadow-lg mt-3 w-full flex rounded overflow-hidden`}
              >
                <div className="py-2 w-12 flex justify-center items-center bg-light-secondary dark:bg-dark-secondary">
                  <i className="text-xs fa-solid fa-lock dark:text-gray-500" />
                </div>
                <input
                  className={`${
                    loading ? "text-gray-400" : "dark:text-gray-200"
                  } w-full px-2 py-2 focus:outline-none bg-light-form dark:bg-dark-form`}
                  type="password"
                  placeholder="Confirm Password"
                  value={password2}
                  onChange={(e) =>
                    setPassword2((password) => {
                      setPasswordRing(
                        Number(passwordRef.current?.value.length) === 0
                          ? 0
                          : Number(passwordRef.current?.value.length) < 8
                          ? 1
                          : 2
                      );
                      setPassword2Ring(
                        Number(password2Ref.current?.value.length) === 0
                          ? 0
                          : Number(password2Ref.current?.value.length) < 8
                          ? 1
                          : 2
                      );
                      return e.target.value;
                    })
                  }
                  minLength={8}
                  required={true}
                  autoComplete="new-password"
                  ref={password2Ref}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="mt-3 flex text-[.6rem] sm:text-xs">
              {/*  */}
              <input
                className={`${
                  loading
                    ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    : "border-black bg-black dark:bg-black/75 hover:bg-black/80 dark:hover:bg-black text-white cursor-pointer"
                } border shadow-lg flex-1 text-center py-1.5 sm:px-4 sm:py-3 rounded`}
                type="button"
                value="SIGN IN"
                onClick={() => {
                  setPassword("");
                  setPassword2("");
                  setUsername("");
                  setEmail("");
                  router.replace("/login");
                }}
                disabled={loading}
              />
              {/*  */}
              <div className="flex-[.1]" />
              {/*  */}
              <input
                className={`${
                  loading
                    ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    : "border-black/50 bg-blue-500 hover:bg-blue-400 dark:bg-pink-500 dark:hover:bg-pink-400 text-white cursor-pointer"
                } border flex-1 text-center sm:px-4 sm:py-3 rounded`}
                type="submit"
                value="REGISTER"
                disabled={
                  loading ||
                  usernameRing === 1 ||
                  emailRing === 1 ||
                  passwordRing === 1 ||
                  password2Ring === 1
                }
              />
              {/*  */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
