import { Dispatch, SetStateAction } from "react";

// components
import Notifications from "@/components/modal components/Notifications";
// context
import { modalContext } from "@/context/modalContext";

// layout
import ModalLayout from "@/layouts/ModalLayout";

interface Props {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}

const NotificationsModal = ({ modal, setModal }: Props) => {
  return (
    <modalContext.Provider value={{ modal, setModal }}>
      <ModalLayout>
        <Notifications />
      </ModalLayout>
    </modalContext.Provider>
  );
};

export default NotificationsModal;
