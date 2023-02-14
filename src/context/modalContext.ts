import { createContext, useContext } from "react";

export type ModalContext = {
  modal: boolean;
  setModal: (modal: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const modalContext = createContext<ModalContext>({
  modal: false,
  setModal: () => {},
  loading: false,
  setLoading: () => {},
});

const useModalContext = () => useContext(modalContext);

export default useModalContext;
