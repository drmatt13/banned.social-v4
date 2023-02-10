import { Dispatch, SetStateAction } from "react";

// components
import Post from "@/components/modal components/Post";
// context
import { modalContext } from "@/context/modalContext";

// layout
import ModalLayout from "@/layouts/ModalLayout";

//types
import type PostType from "@/types/post";

interface Props {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  post: PostType;
  setPost: Dispatch<SetStateAction<PostType>>;
}

const MessagesModal = ({ modal, setModal, post, setPost }: Props) => {
  return (
    <modalContext.Provider value={{ modal, setModal }}>
      <ModalLayout>
        <Post post={post} setPost={setPost} />
      </ModalLayout>
    </modalContext.Provider>
  );
};

export default MessagesModal;
