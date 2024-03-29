import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";
import useCommentContext from "@/context/commentContext";

// styles
import styles from "@/styles/scrollbar.module.scss";

interface Props {
  children: JSX.Element;
  visable?: boolean;
}

const ElevatedPostModalLayout = ({ children, visable = true }: Props) => {
  const { user, navButtonsVisable, darkMode, mobileModal } = useGlobalContext();
  const { modal, setModal, loading } = useModalContext();
  const { setFocused } = useCommentContext();

  const keydownCallback = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
      }
      if (!loading && e.key === "Escape") setModal(false);
    },
    [loading, setModal]
  );

  useEffect(() => {
    if (modal) window.addEventListener("keydown", keydownCallback);
    else {
      window.removeEventListener("keydown", keydownCallback);
      document.body.focus();
    }
    return () => {
      window.removeEventListener("keydown", keydownCallback);
      document.body.focus();
    };
  }, [keydownCallback, modal]);

  return !modal ? (
    <></>
  ) : !visable ? (
    <>{children}</>
  ) : (
    createPortal(
      <>
        {modal && (
          <>
            <style jsx>{`
              @media (max-height: 360px) {
                .fixed {
                  padding-top: 27px !important;
                  padding-bottom: 27px !important;
                  align-items: flex-start !important;
                }
                .max-h-\[85\%\] {
                  max-height: 308px !important;
                }
              }
            `}</style>
            <div
              className={`
          ${
            user?.avatar
              ? "bg-black/20 dark:bg-black/40"
              : "bg-black/[15%] dark:bg-transparent"
          } ${!navButtonsVisable && "z-50"} ${
                mobileModal ? "items-start" : "items-center"
              } fixed flex justify-center h-[100dvh] overflow-y-visible w-screen top-0 left-0 text-black`}
            >
              {mobileModal && (
                <div className="absolute bg-light-secondary dark:bg-dark-secondary top-0 w-full h-screen" />
              )}
              <div
                className="absolute top-0 h-[100dvh] w-full"
                onClick={() => {
                  user?.avatar && !loading && !mobileModal && setModal(false);
                  setFocused(undefined);
                }}
                onDragStart={(e) => e.preventDefault()}
                onDragCapture={(e) => e.preventDefault()}
                onDropCapture={(e) => e.preventDefault()}
                onDragOverCapture={(e) => e.preventDefault()}
              />
              <div
                className={`${
                  mobileModal && darkMode && "dark:[color-scheme:dark]"
                } ${
                  mobileModal
                    ? "bg-light-secondary dark:bg-dark-secondary dark:text-white/90 w-full max-h-[100dvh]"
                    : `${
                        user?.avatar
                          ? "bg-white/[85%] dark:bg-white/75 backdrop-blur"
                          : "bg-white/75 dark:bg-white/50"
                      } border border-gray-300 dark:border-gray-500 shadow-lg rounded-xl w-[95%] max-w-[550px] max-h-[85%]`
                } pointer-events-auto overflow-y-hidden flex relative`}
              >
                <div
                  className={`${
                    !mobileModal && "max-h-[85%]"
                  } w-full z-50 flex flex-col`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {children}
                </div>
              </div>
            </div>
          </>
        )}
      </>,
      document.getElementById("modal")!
    )
  );
};

export default ElevatedPostModalLayout;
