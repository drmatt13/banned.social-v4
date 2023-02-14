import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
  useDeferredValue,
} from "react";

// components
import PostDesktop from "@/components/modal components/PostDesktop";
import PostMobile from "@/components/modal components/PostMobile";

// context
import useGlobalContext from "@/context/globalContext";
import { modalContext } from "@/context/modalContext";

// layout
import ModalLayout from "@/layouts/ModalLayout";

//types
import type Post from "@/types/post";
import type User from "@/types/user";

interface Props {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
  recipient?: User;
}

const PostModal = ({ modal, setModal, post, setPost, recipient }: Props) => {
  const { mobile } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [screenWidth, setScreenWidth] = useState(0);
  const deferredScreenWidth = useDeferredValue(screenWidth);

  const adjustWidth = useCallback(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    adjustWidth();
    setInitialLoad(false);
    window.addEventListener("resize", adjustWidth);
    return () => {
      window.removeEventListener("resize", adjustWidth);
    };
  }, [adjustWidth]);

  return (
    <modalContext.Provider value={{ modal, setModal, loading, setLoading }}>
      {initialLoad ? (
        <></>
      ) : (
        <>
          {mobile || deferredScreenWidth < 600 ? (
            !modal ? (
              <></>
            ) : (
              <PostMobile post={post} setPost={setPost} recipient={recipient} />
            )
          ) : (
            <>
              <ModalLayout>
                <PostDesktop
                  post={post}
                  setPost={setPost}
                  recipient={recipient}
                />
              </ModalLayout>
            </>
          )}
        </>
      )}
    </modalContext.Provider>
  );
};

export default PostModal;
