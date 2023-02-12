import { Dispatch, SetStateAction } from "react";

// components
import UpdateAvatar from "@/components/modal components/UpdateAvatar";

// context
import { modalContext } from "@/context/modalContext";

// layout
import ModalLayout from "@/layouts/ModalLayout";

interface Props {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}

const UpdateAvatarModal = ({ modal, setModal }: Props) => {
  return (
    <modalContext.Provider value={{ modal, setModal }}>
      <ModalLayout>
        <UpdateAvatar />
      </ModalLayout>
    </modalContext.Provider>
  );
};

export default UpdateAvatarModal;