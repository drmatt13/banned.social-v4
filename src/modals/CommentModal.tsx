import { Dispatch, SetStateAction, useState, useEffect } from "react";

// components
import ElevatedPost from "@/components/modal/comment/ElevatedPost";

// context
import { modalContext } from "@/context/modalContext";

// layout
import ElevatedPostModalLayout from "@/layouts/ElevatedPostModalLayout";

interface Props {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}

const CommentModal = ({ modal, setModal }: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <modalContext.Provider value={{ modal, setModal, loading, setLoading }}>
      <ElevatedPostModalLayout>
        <ElevatedPost />
      </ElevatedPostModalLayout>
    </modalContext.Provider>
  );
};

export default CommentModal;
