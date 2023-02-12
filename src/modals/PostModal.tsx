import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
  useDeferredValue,
} from "react";

// components
import Post from "@/components/modal components/Post";
import MobilePost from "@/components/MobilePost";

// context
import useGlobalContext from "@/context/globalContext";
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
  recipient: string;
}

const PostModal = ({ modal, setModal, post, setPost, recipient }: Props) => {
  const { mobile } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(0);
  const deferredScreenWidth = useDeferredValue(screenWidth);

  const adjustWidth = useCallback(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    setLoading(false);
    window.addEventListener("resize", adjustWidth);
    return () => {
      window.removeEventListener("resize", adjustWidth);
    };
  }, [adjustWidth, loading]);

  return (
    <modalContext.Provider value={{ modal, setModal }}>
      {loading ? (
        <></>
      ) : (
        <>
          {mobile && deferredScreenWidth < 768 ? (
            !modal ? (
              <></>
            ) : (
              <MobilePost post={post} setPost={setPost} recipient={recipient} />
            )
          ) : (
            <>
              <ModalLayout>
                <Post post={post} setPost={setPost} recipient={recipient} />
              </ModalLayout>
            </>
          )}
        </>
      )}
    </modalContext.Provider>
  );
};

export default PostModal;
