import { Dispatch, SetStateAction, useState } from "react";

// components
import Messages from "@/components/modal components/Messages";
// context
import { modalContext } from "@/context/modalContext";

// layout
import ModalLayout from "@/layouts/ModalLayout";

interface Props {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}

const MessagesModal = ({ modal, setModal }: Props) => {
  const [loading, setLoading] = useState(false);
  return (
    <modalContext.Provider value={{ modal, setModal, loading, setLoading }}>
      <ModalLayout>
        <Messages />
      </ModalLayout>
    </modalContext.Provider>
  );
};

export default MessagesModal;
