import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";

interface Props {
  children: JSX.Element;
  visable?: boolean;
  styles?: string;
}

const Modal = ({ children, visable = true, styles }: Props) => {
  const { user, navButtonsVisable } = useGlobalContext();
  const { modal, setModal, loading } = useModalContext();

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
            onClick={() => user?.avatar && !loading && setModal(false)}
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
              className={`${styles} w-full max-h-[85%] overflow-y-auto z-50`}
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
