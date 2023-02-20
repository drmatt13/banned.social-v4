import {
  useState,
  useEffect,
  useCallback,
  useDeferredValue,
  useRef,
} from "react";

// components
import PostDesktop from "@/components/modal components/PostDesktop";
import PostMobile from "@/components/modal components/PostMobile";
import PostInput from "@/components/modal components/PostInput";

// context
import useModalContext from "@/context/modalContext";
import usePostContext from "@/context/postContext";

// layout
import ModalLayout from "@/layouts/ModalLayout";

const PostModal = () => {
  const { modal } = useModalContext();
  const { postStyle } = usePostContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [caretPosition, setCaretPosition] = useState(0);

  useEffect(() => {
    return () => {
      setCaretPosition(0);
    };
  }, []);

  return modal ? (
    <>
      <ModalLayout visable={postStyle !== "mobile"}>
        <PostDesktop>
          <PostMobile>
            <PostInput
              textareaRef={textareaRef}
              caretPosition={caretPosition}
              setCaretPosition={setCaretPosition}
            />
          </PostMobile>
        </PostDesktop>
      </ModalLayout>
    </>
  ) : (
    <></>
  );
};

export default PostModal;
