import { useState, useEffect, useRef, useCallback } from "react";

// components
import NavButton from "./NavButton";

// context
import { useGlobalContext } from "@/context/globalContext";

// styles
import styles from "@/styles/Navbar.module.scss";

const Navbar = () => {
  const { mobile, logout, navVisable, setNavVisable, toggleDarkMode } =
    useGlobalContext();

  const navContainerRef = useRef<HTMLElement | null>(null);
  const diamondRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<Array<HTMLDivElement>>([]);
  const directionRef = useRef<"left" | "right">("left");
  const dateRef = useRef<number>(Date.now());
  const animationStateRef = useRef<number>(0);

  const [buttonsVisable, setButtonsVisable] = useState(false);

  useEffect(() => {
    if (
      !buttonsVisable &&
      buttonsRef.current[0]?.style.animationPlayState === "paused"
    )
      return;
    if (buttonsRef.current[0]?.style.animationPlayState === "paused") {
      buttonsRef.current.forEach((button) => {
        button.style.animationPlayState = "running";
        button.style.display = "";
        dateRef.current = Date.now();
      });
    }
    const animationContainer = navContainerRef.current?.firstChild
      ?.lastChild as HTMLDivElement;
    const dT = (Date.now() - dateRef.current) * 0.001;
    if (buttonsVisable) {
      animationStateRef.current -= dT;
      if (
        animationStateRef.current < 0.25 &&
        directionRef.current === "right"
      ) {
        animationStateRef.current = 0;
        directionRef.current = "left";
      } else if (animationStateRef.current < 0) {
        animationStateRef.current = 0;
      }
      animationContainer.classList.remove(
        styles.closeLeft as string,
        styles.closeRight as string
      );
      animationContainer.classList.add(
        directionRef.current === "left"
          ? (styles.openLeft as string)
          : (styles.openRight as string)
      );
      buttonsRef.current.forEach((button, i) => {
        button.style.animationDelay = `${
          (7 - i) * (0.25 / 6) - animationStateRef.current
        }s`;
      });
    } else {
      animationStateRef.current += dT;
      if (animationStateRef.current > 0.4) {
        animationStateRef.current = 0.5;
        directionRef.current = "right";
      }
      animationContainer.classList.remove(
        styles.openLeft as string,
        styles.openRight as string
      );
      animationContainer.classList.add(
        directionRef.current === "left"
          ? (styles.closeLeft as string)
          : (styles.closeRight as string)
      );
      buttonsRef.current.forEach((button, i) => {
        button.style.animationDelay = `-${
          0.25 - animationStateRef.current / 2
        }s`;
      });
    }
    dateRef.current = Date.now();
  }, [buttonsVisable]);

  useEffect(() => {
    buttonsRef.current = navContainerRef.current?.firstChild?.lastChild
      ?.childNodes as unknown as Array<HTMLDivElement>;
    buttonsRef.current.forEach((button) => {
      button.style.animationPlayState = "paused";
      button.style.display = "none";
    });
    const adjustHeight = () => {
      const size =
        window.screen.height / 20 > 36
          ? 36
          : window.screen.height / 20 < 24
          ? 24
          : window.screen.height / 20;
      (diamondRef?.current?.parentNode as HTMLDivElement)?.setAttribute(
        "style",
        `height: ${size}px !important; width: ${size}px !important;`
      );
    };
    const adjustPadding = () => {
      const size =
        window.screen.width / 12.5 > 36
          ? 36
          : window.screen.width / 12.5 < 24
          ? 24
          : window.screen.width / 12.5;
      navContainerRef?.current?.setAttribute(
        "style",
        `padding-right: ${size}px !important;`
      );
    };
    if (mobile) {
      adjustHeight();
      adjustPadding();
      diamondRef.current?.classList.add("duration-75");
      (diamondRef.current?.firstChild as HTMLDivElement)?.classList.add(
        "duration-75"
      );
      screen.orientation.addEventListener("change", adjustHeight);
      return () => {
        screen.orientation.removeEventListener("change", adjustHeight);
      };
    }
  }, [mobile]);

  return (
    <>
      <style jsx>{`
        .relative {
          height: clamp(1.5em, 5vh, 2.25em);
          width: clamp(1.5em, 5vh, 2.25em);
        }
        .diamondRef {
          box-shadow: 0 0 0.75em rgb(216, 139, 235);
          border: 1px solid transparent;
          border-image: linear-gradient(45deg, #0b879380, #946a9080);
          border-image-slice: 1;
        }
        .innerDiamond {
          background-image: linear-gradient(
            45deg,
            #ffa2a2b0 0%,
            #bbc1bfb0 19%,
            #57c6e1b0 42%,
            #b49fdab0 79%,
            #7ac5d8b0 100%
          );
        }
      `}</style>
      <nav
        ref={navContainerRef}
        className={`z-50 h-28 sticky top-0 py-10 pr-6 xs:pr-8 sm:pr-10 lg:pr-14 flex flex-row-reverse select-none pointer-events-none`}
      >
        <div
          className={`relative ${
            true ? "opacity-100 duration-300" : "opacity-0 duration-700"
          } transition-opacity`}
        >
          <div
            onClick={() => setButtonsVisable(() => !buttonsVisable)}
            ref={diamondRef}
            className={`
            ${navVisable ? `pointer-events-auto` : "pointer-events-none"} 
            ${
              mobile
                ? `
            active:scale-125 
            active:border-opacity-100`
                : `
            hover:scale-125 
            hover:border-opacity-100`
            }
            group 
            diamondRef 
            absolute 
            rounded-sm 
            cursor-pointer 
            rotate-45 
            h-full 
            w-full 
            border 
            border-gray-500 
            dark:border-gray-600 
            border-opacity-80 
            transition-all
            ease-linear

          `}
          >
            <div
              className={`
              ${
                mobile
                  ? `
              group-active:opacity-100 
              group-active:border 
              group-active:scale-50 
            group-active:border-gray-500 
              group-active:border-opacity-25
                  `
                  : `
              group-hover:opacity-100 
              group-hover:border 
              group-hover:scale-50 
            group-hover:border-gray-500 
              group-hover:border-opacity-25
              `
              }
              innerDiamond 
              pointer-events-none 
              absolute 
              opacity-0 
              rounded-sm 
              cursor-pointer 
              h-full 
              w-full
              transition-all
              ease-linear
            `}
            />
          </div>
          {true !== undefined && (
            <div
              className={`${
                buttonsVisable
                  ? "/opacity-100 pointer-events-auto /duration-500"
                  : "/opacity-0 pointer-events-none /duration-[.25s]"
              } h-full w-full absolute flex flex-col items-center text-xs transition-opacity -z-10`}
            >
              <NavButton
                className="fas fa-earth-americas"
                // onClick={redirectHome}
              />
              <NavButton
                className="fas fa-newspaper"
                // onClick={() => toggleModal("apps")}
              />
              <NavButton
                className="fas fa-user"
                //onClick={redirectHome}
              />
              <NavButton
                className="fa-solid fa-comment"
                // onClick={() => toggleModal("notes")}
                // setNotifications={setNotifications}
                notifications={3}
              />
              <NavButton
                className="fas fa-bell"
                onClick={toggleDarkMode}
                // setNotifications={setNotifications}
                // notifications={2}
              />
              <NavButton className="fas fa-gear" onClick={logout} />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
