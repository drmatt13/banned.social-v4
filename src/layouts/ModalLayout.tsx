import { createPortal } from "react-dom";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";

interface Props {
  children: React.ReactNode;
}

const Modal = ({ children }: Props) => {
  const { user } = useGlobalContext();
  const { modal, setModal } = useModalContext();

  return !modal ? (
    <></>
  ) : (
    createPortal(
      <>
        <div
          className={`${
            user?.avatar
              ? "bg-black/30 dark:bg-black/40"
              : "bg-black/[15%] dark:bg-transparent"
          } z-50 fixed h-screen overflow-y-auto w-screen top-0 left-0 text-black`}
        >
          <div className="max-h-[700px] h-[70vh] min-h-[420px] mt-20 flex justify-center items-center">
            <div
              className="absolute top-0 h-full w-full"
              onClick={() => user?.avatar && setModal(false)}
            />
            <div className="z-10 w-full flex justify-center pointer-events-none">
              <div
                className={`${
                  user?.avatar
                    ? "bg-white/80 dark:bg-white/75 backdrop-blur"
                    : "bg-white/75 dark:bg-white/50"
                } pointer-events-auto overflow-hidden relative border  border-gray-300 dark:border-gray-500 shadow-lg rounded-2xl w-[95%] max-w-[500px]`}
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
