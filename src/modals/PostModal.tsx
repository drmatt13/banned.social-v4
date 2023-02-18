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
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";
import usePostContext from "@/context/postContext";

// layout
import ModalLayout from "@/layouts/ModalLayout";

const PostModal = () => {
  const { modal } = useModalContext();
  const { setInitialLoad } = usePostContext();
  const { mobile } = useGlobalContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [caretPosition, setCaretPosition] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [postStyle, setPostStyle] = useState<"mobile" | "desktop">("desktop");

  const deferredScreenWidth = useDeferredValue(screenWidth);

  const adjustWidth = useCallback(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    adjustWidth();
    setLoading(false);
    if (!modal) setInitialLoad(true);
    window.addEventListener("resize", adjustWidth);
    return () => {
      setCaretPosition(0);
      window.removeEventListener("resize", adjustWidth);
    };
  }, [adjustWidth, modal, setInitialLoad]);

  useEffect(() => {
    if (!mobile && deferredScreenWidth >= 600) {
      setPostStyle("desktop");
    } else {
      setPostStyle("mobile");
    }
  }, [deferredScreenWidth, mobile]);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        modal && (
          <>
            <ModalLayout visable={postStyle !== "mobile"}>
              <PostDesktop visable={postStyle !== "mobile"}>
                <PostMobile visable={postStyle === "mobile"}>
                  <PostInput
                    textareaRef={textareaRef}
                    caretPosition={caretPosition}
                    setCaretPosition={setCaretPosition}
                    postStyle={postStyle}
                  />
                </PostMobile>
              </PostDesktop>
            </ModalLayout>
          </>
        )
      )}
    </>
  );
};

export default PostModal;
