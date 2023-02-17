import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type ModalContext = {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export const modalContext = createContext<ModalContext>({
  modal: false,
  setModal: () => {},
  loading: false,
  setLoading: () => {},
});

const useModalContext = () => useContext(modalContext);

export default useModalContext;
