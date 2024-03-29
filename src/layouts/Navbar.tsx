import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";

// components
import NavButton from "../components/NavButton";
import SearchBar from "../components/SearchBar";

// context
import useGlobalContext from "@/context/globalContext";

// modals
import SettingsModal from "@/modals/SettingsModal";
import MessagesModal from "@/modals/MessagesModal";
import NotificationsModal from "@/modals/NotificationsModal";

// styles
import styles from "@/styles/Navbar.module.scss";

const Navbar = () => {
  const router = useRouter();

  const {
    user,
    mobile,
    navContainerVisable,
    setNavContainerVisable,
    navButtonsVisable,
    setNavButtonsVisable,
    darkMode,
  } = useGlobalContext();

  const navContainerRef = useRef<HTMLElement | null>(null);
  const diamondRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<Array<HTMLDivElement>>([]);
  const directionRef = useRef<"left" | "right">("left");
  const dateRef = useRef<number>(Date.now());
  const animationStateRef = useRef<number>(0);

  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState<
    "messages" | "notifications" | "settings" | false
  >(false);

  const openModal = useCallback((string: Exclude<typeof modalType, false>) => {
    // setNavButtonsVisable(false);
    setModalType(string);
  }, []);

  useEffect(() => {
    if (modalType !== false) setModal(true);
  }, [modalType]);

  useEffect(() => {
    if (modal === false) setModalType(false);
  }, [modal]);

  useEffect(() => {
    if (
      !navButtonsVisable &&
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
    if (navButtonsVisable) {
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
  }, [navButtonsVisable]);

  useEffect(() => {
    buttonsRef.current = navContainerRef.current?.firstChild?.lastChild
      ?.childNodes as unknown as Array<HTMLDivElement>;
    buttonsRef.current.forEach((button) => {
      button.style.animationPlayState = "paused";
      button.style.display = "none";
    });
    if (mobile) {
      diamondRef.current?.classList.add("duration-75");
      (diamondRef.current?.firstChild as HTMLDivElement)?.classList.add(
        "duration-75"
      );
    }
  }, [mobile]);

  useEffect(() => {
    const eventListener = () => {
      if (modal && window.innerWidth < 768) setNavButtonsVisable(false);
    };
    window.addEventListener("resize", eventListener);
    return () => window.removeEventListener("resize", eventListener);
  }, [modal, navButtonsVisable, setNavButtonsVisable]);

  return (
    <>
      <style jsx>{`
        @media (max-width: 640px) {
          .relative {
            height: 1.7em !important;
            width: 1.7rem !important;
          }
        }
        .relative {
          height: clamp(1.7em, 5vh, 2.25em);
          width: clamp(1.7em, 5vh, 2.25em);
        }

        .diamondRef {
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
        @media (min-width: 2024px) {
          .z-10 {
            width: 1600px;
          }
        }
      `}</style>
      <nav
        ref={navContainerRef}
        className={`z-50 h-full sticky top-0 pt-6 pr-6 sm:pr-10 lg:pt-8 lg:pr-14 flex flex-row-reverse select-none pointer-events-none overflow-visible w-full`}
      >
        <div
          className={`relative ${
            true ? "opacity-100 duration-300" : "opacity-0 duration-700"
          } transition-opacity`}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              setModal(false);
              setNavButtonsVisable(!navButtonsVisable);
            }}
            ref={diamondRef}
            className={`
            ${
              navContainerVisable
                ? `pointer-events-auto`
                : "pointer-events-none"
            } 
            ${
              mobile
                ? `
            active:scale-125 
            active:border-opacity-100`
                : `
            hover:scale-125 
            hover:border-opacity-100`
            }
            ${modal && !darkMode && "backdrop-brightness-125"}
            backdrop-blur
            dark:backdrop-brightness-75
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
            transition-transform
            ease-linear
          `}
            style={{
              boxShadow: darkMode
                ? "0 0 0.75em rgb(215, 140, 235)"
                : "0 0 1em rgb(40, 115, 200, 0.75)",
            }}
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
                navButtonsVisable
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              } h-full w-full absolute flex flex-col items-center text-xs transition-opacity -z-10`}
            >
              <NavButton
                className="fas fa-earth-americas"
                onClick={() => {
                  setModal(false);
                  setNavButtonsVisable(false);
                  router.replace(`/`);
                }}
              />
              <NavButton
                className="fas fa-newspaper"
                onClick={() => {
                  setModal(false);
                  setNavButtonsVisable(false);
                  router.replace(`/news`);
                }}
              />
              <NavButton
                className="fas fa-user"
                onClick={() => {
                  setModal(false);
                  setNavButtonsVisable(false);
                  router.replace(`/${user?._id}`);
                }}
              />
              <NavButton
                className="fa-solid fa-comment"
                notifications={3}
                onClick={() => {
                  if (modalType === "messages") {
                    setModal(false);
                    setNavButtonsVisable(false);
                  } else {
                    if (window.innerWidth < 768) {
                      setNavButtonsVisable(false);
                    }
                    openModal("messages");
                  }
                }}
              />
              <NavButton
                className="fas fa-bell"
                notifications={2}
                onClick={() => {
                  if (modalType === "notifications") {
                    setModal(false);
                    setNavButtonsVisable(false);
                  } else {
                    if (window.innerWidth < 768) {
                      setNavButtonsVisable(false);
                    }
                    openModal("notifications");
                  }
                }}
              />
              <NavButton
                className="fas fa-gear"
                onClick={() => {
                  if (modalType === "settings") {
                    setModal(false);
                    setNavButtonsVisable(false);
                  } else {
                    if (window.innerWidth < 768) {
                      setNavButtonsVisable(false);
                    }
                    openModal("settings");
                  }
                }}
              />
            </div>
          )}
        </div>
        <div className="absolute left-4 top-4">
          <SearchBar />
          <div
            onClick={() => setModal(false)}
            className={`${
              (!modal || (modal && !navButtonsVisable)) && "hidden"
            } z-10 absolute left-0 top-0 w-full h-full rounded-full bg-black/[6%] dark:bg-black/[38%] pointer-events-auto`}
          />
        </div>
      </nav>
      <MessagesModal
        modal={Boolean(modalType === "messages")}
        setModal={setModal}
      />
      <NotificationsModal
        modal={Boolean(modalType === "notifications")}
        setModal={setModal}
      />
      <SettingsModal
        modal={Boolean(modalType === "settings")}
        setModal={setModal}
      />
    </>
  );
};

export default Navbar;
