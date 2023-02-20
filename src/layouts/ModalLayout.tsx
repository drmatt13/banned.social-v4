import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";

interface Props {
  children: JSX.Element;
  visable?: boolean;
}

const Modal = ({ children, visable = true }: Props) => {
  const { user, navButtonsVisable } = useGlobalContext();
  const { modal, setModal } = useModalContext();

  const eventListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " " && e.target === document.body) {
        e.preventDefault();
      }
      if (e.key === "Escape") setModal(false);
    },
    [setModal]
  );

  useEffect(() => {
    if (modal) window.addEventListener("keydown", eventListener);
    else {
      window.removeEventListener("keydown", eventListener);
      document.body.focus();
    }
    return () => {
      window.removeEventListener("keydown", eventListener);
      document.body.focus();
    };
  }, [eventListener, modal]);

  return !modal ? (
    <></>
  ) : !visable ? (
    <>{children}</>
  ) : (
    createPortal(
      <>
        <style jsx>{`
          .items-center {
            margin-top: 22.5vh;
          }
          @media (max-height: 500px) {
            .items-center {
              margin-top: 15vh;
              margin-bottom: 1.5rem;
            }
          }
          @media (max-height: 440px) {
            .items-center {
              margin-top: 10vh;
            }
          }
        `}</style>
        <div
          className={`${
            user?.avatar
              ? "bg-black/20 dark:bg-black/40"
              : "bg-black/[15%] dark:bg-transparent"
          } ${
            !navButtonsVisable && "z-50"
          } fixed h-screen overflow-y-auto w-screen top-0 left-0 text-black`}
        >
          <div className="flex justify-center items-center">
            <div
              className="absolute top-0 h-full w-full"
              onClick={() => user?.avatar && setModal(false)}
              onDragStart={(e) => e.preventDefault()}
              onDragCapture={(e) => e.preventDefault()}
              onDropCapture={(e) => e.preventDefault()}
              onDragOverCapture={(e) => e.preventDefault()}
            />
            <div className="z-10 w-full flex justify-center pointer-events-none">
              <div
                className={`${
                  user?.avatar
                    ? "bg-white/[85%] dark:bg-white/75 backdrop-blur"
                    : "bg-white/75 dark:bg-white/50"
                } pointer-events-auto overflow-hidden relative border border-gray-300 dark:border-gray-500 shadow-lg rounded-2xl w-[95%] max-w-[500px] mb-5`}
                onClick={(e) => e.stopPropagation()}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </>,
      document.getElementById("modal")!
    )
  );
};

export default Modal;
