import { Dispatch, SetStateAction, useState } from "react";

// components
import Notifications from "@/components/modal/Notifications";
// context
import { modalContext } from "@/context/modalContext";

// layout
import ModalLayout from "@/layouts/ModalLayout";

interface Props {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}

const NotificationsModal = ({ modal, setModal }: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <modalContext.Provider value={{ modal, setModal, loading, setLoading }}>
      <ModalLayout>
        <Notifications />
      </ModalLayout>
    </modalContext.Provider>
  );
};

export default NotificationsModal;
