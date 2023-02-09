import { createContext, useContext } from "react";

export type ModalContext = {
  modal: boolean;
  setModal: (modal: boolean) => void;
};

export const modalContext = createContext<ModalContext>({
  modal: false,
  setModal: () => {},
});

const useModalContext = () => useContext(modalContext);

export default useModalContext;
