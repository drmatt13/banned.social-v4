/* eslint-disable @next/next/no-img-element */
import { useEffect, useCallback, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

import DOMPurify from "dompurify";

// components
import Loading from "@/components/Loading";

// context
import useModalContext from "@/context/modalContext";
import useGlobalContext from "@/context/globalContext";
import usePostContext from "@/context/postContext";

// libraries
import validateUrl from "@/lib/validateUrl";

function removeLastIndex(arr: any[]): any[] {
  if (arr.length > 1) {
    return arr.slice(0, -1);
  } else {
    return [];
  }
}

interface Props {
  caretPosition: number;
  setCaretPosition: React.Dispatch<React.SetStateAction<number>>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  postStyle: "mobile" | "desktop";
}

const PostInput = ({
  textareaRef,
  caretPosition,
  setCaretPosition,
  postStyle,
}: Props) => {
  const { user } = useGlobalContext();
  const { loading, setLoading } = useModalContext();
  const {
    initialLoad,
    setInitialLoad,
    post,
    setPost,
    recipient,
    loadingOg,
    setLoadingOg,
    image,
    ogStack,
    setOgStack,
    setImage,
    processUrl,
  } = usePostContext();

  const placeCursorAtEnd = useCallback(
    (textareaElement: HTMLTextAreaElement) => {
      if (!textareaElement) return;
      const textLength = textareaElement.value.length;
      textareaElement.focus();
      textareaElement.setSelectionRange(textLength, textLength);
    },
    []
  );

  const getCaretPosition = useCallback(() => {
    if (!textareaRef.current) return;
    const textareaElement = textareaRef.current;
    const caretPos = textareaElement.selectionStart;
    return caretPos;
  }, [textareaRef]);

  const setCaretPositionInTextArea = useCallback(
    (textareaElement: HTMLTextAreaElement, caretPos: number) => {
      if (!textareaElement) return;
      textareaElement.focus();
      textareaElement.setSelectionRange(caretPos, caretPos);
    },
    []
  );

  const getCurrentWord = useCallback(() => {
    const textarea = textareaRef.current;
    const position = getCaretPosition();
    if (!textarea || !position) return;
    const text = textarea.value || "";
    let startIndex = position - 1;
    let endIndex = position;
    while (startIndex >= 0 && !/\s/.test(text[startIndex] || "")) {
      startIndex--;
    }
    startIndex++;
    while (endIndex < text.length && !/\s/.test(text[endIndex] || "")) {
      endIndex++;
    }
    const currentWord = text.substring(startIndex, endIndex);
    return currentWord;
  }, [getCaretPosition, textareaRef]);

  const handleInput = useCallback(
    (e: any) => {
      if (e.type === "paste") return;
      setCaretPosition(getCaretPosition() || 0);
      console.log(getCurrentWord());
      if (validateUrl(getCurrentWord() || "")) {
        processUrl(getCurrentWord()!);
      }
    },
    [getCaretPosition, getCurrentWord, processUrl, setCaretPosition]
  );

  const handlePaste = useCallback((e: any) => {}, []);

  const windowResizeEvent = useCallback(() => {
    setCaretPosition(getCaretPosition() || 0);
  }, [getCaretPosition, setCaretPosition]);

  useEffect(() => {
    textareaRef.current?.addEventListener("input", handleInput);
    textareaRef.current?.addEventListener("paste", handlePaste);
    window.addEventListener("resize", windowResizeEvent);
    return () => {
      window.removeEventListener("resize", windowResizeEvent);
    };
  }, [
    getCaretPosition,
    handleInput,
    handlePaste,
    setCaretPosition,
    textareaRef,
    windowResizeEvent,
  ]);

  useEffect(() => {
    textareaRef!.current!.innerHTML = DOMPurify.sanitize(post.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!textareaRef.current) return;
    if (initialLoad) {
      placeCursorAtEnd(textareaRef.current!);
      setInitialLoad(false);
    } else {
      if (caretPosition !== 0) {
        setCaretPositionInTextArea(textareaRef.current!, caretPosition);
      } else {
        placeCursorAtEnd(textareaRef.current!);
      }
    }
  }, [
    caretPosition,
    initialLoad,
    placeCursorAtEnd,
    setCaretPositionInTextArea,
    setInitialLoad,
    textareaRef,
  ]);

  return (
    <>
      <div
        className={`${
          postStyle === "desktop" && "pt-2"
        } relative mb-3 overflow-y-auto flex flex-col`}
      >
        <TextareaAutosize
          ref={textareaRef}
          minRows={postStyle === "mobile" ? 6 : 5}
          maxRows={postStyle === "mobile" ? 9 : 7}
          className={`${
            postStyle === "mobile" ? "p-2 text-sm" : "pb-2 px-3.5"
          } outline-none h-full resize-none bg-transparent decoration-none`}
          style={{
            lineHeight: "1.45rem",
          }}
          onInput={(e) => {
            setPost({
              ...post,
              content: e.currentTarget.value,
            });
          }}
        />
        <div className="absolute top-0 pointer-events-none whitespace-pre-wrap break-words">
          {!post.content && (
            <div
              className={`${
                postStyle === "mobile"
                  ? "text-gray-500 dark:text-neutral-400 p-2"
                  : "text-neutral-600 dark:text-neutral-700 py-2 px-3.5"
              }`}
            >{`What's on your mind, ${user?.username}?`}</div>
          )}
        </div>
      </div>
      {loadingOg && ogStack.length === 0 && (
        <div className="relative px-2 mb-3 h-20 w-full">
          <Loading />
        </div>
      )}
      {ogStack.length !== 0 && (post.og?.title || post.og?.description) && (
        <div className="px-2 mb-3 h-20">
          <div
            className={`${
              postStyle === "mobile"
                ? "dark:bg-white/[15%] dark:border-black/40 shadow"
                : "dark:bg-white/40 dark:border-black/[17.5%]"
            } relative p-2 flex bg-white/50 border border-black/[17.5%] w-full h-full rounded`}
          >
            <div
              className=" bg-white absolute h-5 w-5 -top-1.5 -right-1.5 rounded-full p-2 flex justify-center items-center cursor-pointer border shadow"
              onClick={() => setOgStack(removeLastIndex(ogStack))}
            >
              <i className="fas fa-times text-xs text-gray-800 w-5 h-5 flex justify-center items-center"></i>
            </div>
            {post.og.image && (
              <div className="w-14 h-9 bg-black/20 mr-2">
                <img
                  className="w-full h-full border border-gray-500 dark:border-white/[17.5%]"
                  src={post.og.image.url}
                  alt={post.og.title}
                />
              </div>
            )}
            <div className="flex flex-col flex-1 text-xs justify-start overflow-hidden">
              <div className="flex-1">{post.og.title}</div>
              <div className="flex-[2]">{post.og.description}</div>
              <div className="flex-1">{post.og.url}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostInput;
