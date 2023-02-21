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
          className={`${
            user?.avatar
              ? "bg-black/20 dark:bg-black/40"
              : "bg-black/[15%] dark:bg-transparent"
          } ${
            !navButtonsVisable && "z-50"
          } fixed flex justify-center items-center h-screen overflow-y-auto w-screen top-0 left-0 text-black`}
        >
          <div
            className="absolute top-0 h-full w-full"
            onClick={() => user?.avatar && setModal(false)}
            onDragStart={(e) => e.preventDefault()}
            onDragCapture={(e) => e.preventDefault()}
            onDropCapture={(e) => e.preventDefault()}
            onDragOverCapture={(e) => e.preventDefault()}
          />
          <div
            className={`${
              user?.avatar
                ? "bg-white/[85%] dark:bg-white/75 backdrop-blur"
                : "bg-white/75 dark:bg-white/50"
            } pointer-events-auto overflow-y-hidden flex relative border border-gray-300 dark:border-gray-500 shadow-lg rounded-xl w-[95%] max-w-[500px] max-h-[85%]`}
          >
            <div
              className="w-full max-h-[85%] overflow-y-auto z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </div>
        </div>
      </>,
      document.getElementById("modal")!
    )
  );
};

export default Modal;
