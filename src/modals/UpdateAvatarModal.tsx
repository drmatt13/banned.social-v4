import { Dispatch, SetStateAction, useState } from "react";

// components
import UpdateAvatar from "@/components/modal/avatar/UpdateAvatar";

// context
import { modalContext } from "@/context/modalContext";

// layout
import ModalLayout from "@/layouts/ModalLayout";

interface Props {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}

const UpdateAvatarModal = ({ modal, setModal }: Props) => {
  const [loading, setLoading] = useState(true);

  return (
    <modalContext.Provider value={{ modal, setModal, loading, setLoading }}>
      <ModalLayout>
        <UpdateAvatar />
      </ModalLayout>
    </modalContext.Provider>
  );
};

export default UpdateAvatarModal;
