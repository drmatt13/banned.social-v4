import { useCallback, useState, useRef, useEffect } from "react";

// context
import { useGlobalContext } from "@/context/globalContext";

// libaries
import processService from "@/lib/processService";
import validateUsername from "@/lib/validateUsername";

const OAuthSetUsername = () => {
  const { user, setUser } = useGlobalContext();
  const [username, setUsername] = useState("");
  const [usernameRing, setUsernameRing] = useState(0);
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const [usernameError, setUsernameError] = useState("");

  const updateUser = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        setLoading(true);
        const res = await processService("add username", {
          username,
        });
        const { user, error } = res;
        console.log(res);
        if (user) {
          setUser(user);
        }
        if (error) {
          setUsernameError(error);
          setUsernameRing(1);
        }
        setLoading(false);
      } catch (error) {
        alert("Server error");
        setLoading(false);
      }
    },
    [setUser, username]
  );

  useEffect(() => {
    if (usernameError) {
      usernameRef.current?.setCustomValidity(
        "Account with username already exists"
      );
      usernameRef.current?.reportValidity();
      usernameRef.current?.focus();
      setUsernameError("");
    }
  }, [usernameError]);

  return (
    <>
      <form
        onSubmit={updateUser}
        className="mt-36 md:mt-40 lg:mt-44 w-52 sm:w-64 md:w-72 text-sm sm:text-base"
      >
        <div
          className={`${
            usernameRing === 1 ? "ring-1 ring-red-500 dark:ring-red-500" : ""
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
            placeholder="Set Username"
            value={username}
            onChange={(e) =>
              setUsername((username) => {
                setUsernameRing(
                  e.target.value.length === 0
                    ? 0
                    : validateUsername(e.target.value)
                    ? 2
                    : 1
                );
                return e.target.value;
              })
            }
            minLength={3}
            required={true}
            ref={usernameRef}
            disabled={loading}
            onInput={() => usernameRef.current?.setCustomValidity("")}
          />
        </div>
        <div className="mt-3 flex text-[.6rem] sm:text-xs">
          <input
            className={`${
              loading
                ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "border-black bg-black dark:bg-black/75 hover:bg-black/80 dark:hover:bg-black text-white cursor-pointer"
            } border shadow-lg flex-1 text-center py-1.5 sm:px-4 sm:py-3 rounded`}
            type="button"
            value="RANDOMIZE"
            disabled={loading}
          />

          <div className="flex-[.1]" />
          <input
            className={`${
              loading
                ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "border-black/50 bg-blue-500 hover:bg-blue-400 dark:bg-pink-500 dark:hover:bg-pink-400 text-white cursor-pointer"
            } border flex-1 text-center sm:px-4 sm:py-3 rounded`}
            type="submit"
            value="CONTINUE"
            disabled={loading}
          />
        </div>
      </form>
    </>
  );
};

export default OAuthSetUsername;
