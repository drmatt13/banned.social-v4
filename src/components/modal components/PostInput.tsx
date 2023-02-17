/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useCallback, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

import DOMPurify from "dompurify";

// context
import useModalContext from "@/context/modalContext";
import useGlobalContext from "@/context/globalContext";
import usePostContext from "@/context/postContext";

// libraries
import validateUrl from "@/lib/validateUrl";

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
    getOgData,
    loadingOg,
    setLoadingOg,
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

  const handleInput = useCallback(() => {
    const caretPos = getCaretPosition();
    console.log(getCurrentWord());
    setCaretPosition(caretPos!);
  }, [getCaretPosition, getCurrentWord, setCaretPosition]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.addEventListener("input", handleInput);
    textareaRef.current.addEventListener("keydowm", handleInput);
    textareaRef.current.addEventListener("touchend", handleInput);
    textareaRef.current.addEventListener("click", handleInput);

    return () => {
      if (!textareaRef!.current) return;
      textareaRef!.current.removeEventListener("input", handleInput);
      textareaRef!.current.removeEventListener("keydowm", handleInput);
      textareaRef!.current.removeEventListener("touchend", handleInput);
      textareaRef!.current.removeEventListener("click", handleInput);
    };
  }, [handleInput, textareaRef]);

  useEffect(() => {
    textareaRef!.current!.innerHTML = DOMPurify.sanitize(post.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textareaRef]);

  useEffect(() => {
    if (!textareaRef.current) return;
    if (initialLoad) {
      placeCursorAtEnd(textareaRef.current!);
      setInitialLoad(false);
    } else {
      setCaretPositionInTextArea(textareaRef.current!, caretPosition);
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
      <div className={`relative mb-3 overflow-y-auto flex flex-col`}>
        <TextareaAutosize
          ref={textareaRef}
          minRows={postStyle === "mobile" ? 6 : 5}
          maxRows={postStyle === "mobile" ? 9 : 7}
          className={`${
            postStyle === "mobile" ? "p-2 text-sm" : "py-2 px-3.5"
          } outline-none h-full resize-none bg-transparent decoration-none`}
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
      {loadingOg && <div className="px-2 mb-3 h-20">loading...</div>}
      {!loadingOg && (post.og?.title || post.og?.description) && (
        <div className="px-2 mb-3 h-20">
          <div className="p-2 flex bg-gray-200 dark:bg-dark-form border border-gray-300 dark:border-white/10  w-full h-full rounded-sm">
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
