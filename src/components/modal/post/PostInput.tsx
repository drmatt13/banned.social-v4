import { useEffect, useCallback, useRef, useDeferredValue } from "react";
import TextareaAutosize from "react-textarea-autosize";

import DOMPurify from "dompurify";

// components
import OgContent from "@/components/modal/post/OgContent";
import PostImage from "./PostImage";

// context
import useModalContext from "@/context/modalContext";
import useGlobalContext from "@/context/globalContext";
import usePostContext from "@/context/postContext";

// libraries
import validateUrl from "@/lib/validateUrl";

// styles
import styles from "@/styles/scrollbar.module.scss";

interface Props {
  caretPosition: number;
  setCaretPosition: React.Dispatch<React.SetStateAction<number>>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const PostInput = ({ textareaRef, caretPosition, setCaretPosition }: Props) => {
  const { user, mobile, darkMode } = useGlobalContext();
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
    processUrl,
    postStyle,
  } = usePostContext();

  const duplicateTextRef = useRef<HTMLDivElement>(null);
  const fakeTextareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustInputSize = useCallback(() => {
    const fakeTextarea = fakeTextareaRef.current;
    const p = duplicateTextRef.current;
    const textarea = textareaRef.current;
    if (!textarea || !fakeTextarea || !p) return;
    textarea.style.height = `${fakeTextarea.offsetHeight}px`;
    const scrollbarWidth = textarea.offsetWidth - textarea.clientWidth;
    p.style.width = `${textarea.offsetWidth - scrollbarWidth}px`;
  }, [textareaRef]);

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
      if (validateUrl(getCurrentWord() || "")) {
        processUrl(getCurrentWord()!);
      }
    },
    [getCaretPosition, getCurrentWord, processUrl, setCaretPosition]
  );

  const handlePaste = useCallback(
    (e: any) => {
      const clipboardData = e.clipboardData;
      const text = clipboardData.getData("text");
      const words = text.split(/\s+/);
      for (let i = words.length - 1; i >= 0; i--) {
        if (validateUrl(words[i])) {
          processUrl(words[i]);
          return;
        }
      }
    },
    [processUrl]
  );

  const windowResizeEvent = useCallback(() => {
    setCaretPosition(getCaretPosition() || 0);
    adjustInputSize();
  }, [adjustInputSize, getCaretPosition, setCaretPosition]);

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea?.addEventListener("input", handleInput);
    textarea?.addEventListener("paste", handlePaste);
    window.addEventListener("resize", windowResizeEvent);
    return () => {
      window.removeEventListener("resize", windowResizeEvent);
      textarea?.removeEventListener("input", handleInput);
      textarea?.removeEventListener("paste", handlePaste);
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
      if (ogStack.length === 0) {
        const words = post.content.split(/\s+/);
        for (let i = words.length - 1; i >= 0; i--) {
          if (validateUrl(words[i] || "")) {
            setLoadingOg(true);
            processUrl(words[i] || "");
            break;
          }
        }
      }
      setInitialLoad(false);
    } else {
      if (caretPosition !== 0) {
        setCaretPositionInTextArea(textareaRef.current!, caretPosition);
      } else {
        placeCursorAtEnd(textareaRef.current!);
      }
    }
    adjustInputSize();
  }, [
    adjustInputSize,
    caretPosition,
    initialLoad,
    ogStack.length,
    placeCursorAtEnd,
    post.content,
    processUrl,
    setCaretPositionInTextArea,
    setInitialLoad,
    setLoadingOg,
    textareaRef,
  ]);

  const wrapUrlsInSpans = useCallback(
    (text: string) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const wrappedText = text.replace(
        urlRegex,
        `<span class="${
          postStyle === "mobile"
            ? "dark:text-purple-400 dark:bg-dark-secondary"
            : "dark:text-blue-500"
        } text-blue-500">$&</span>`
      );
      return wrappedText;
    },
    [postStyle]
  );

  useEffect(() => {
    let text = post.content;
    duplicateTextRef.current!.innerHTML = wrapUrlsInSpans(text);
  }, [post.content, wrapUrlsInSpans]);

  return (
    <>
      <div
        className={`relative mb-3 flex flex-col shirk-0 overflow-hidden w-full`}
      >
        <div
          className={`${
            postStyle === "desktop"
              ? `${darkMode ? styles.darkScroll : styles.lightScroll} pr-2`
              : "dark:[color-scheme:dark]"
          } flex`}
        >
          <div className="relative w-full flex flex-col">
            <TextareaAutosize
              ref={fakeTextareaRef}
              value={post.content}
              minRows={image ? (postStyle === "desktop" ? 2 : 3) : 5}
              maxRows={postStyle === "mobile" ? (image ? 6 : 8) : image ? 5 : 7}
              className={`${
                postStyle === "mobile"
                  ? "p-2 text-sm dark:caret-white"
                  : "py-2 px-3.5 dark:caret-black "
              } outline-none h-full resize-none bg-transparent decoration-none pointer-events-none`}
              style={{
                lineHeight: "1.45rem",
              }}
              tabIndex={-1}
            />
            <p
              ref={duplicateTextRef}
              className={`${
                postStyle === "mobile" ? "p-2 text-sm" : "py-2 px-3.5"
              } text-transparent h-full absolute left-0 whitespace-pre-wrap break-words pointer-events-none`}
              style={{
                lineHeight: "1.45rem",
              }}
              tabIndex={-1}
            >
              {post.content}
            </p>
            <TextareaAutosize
              ref={textareaRef}
              minRows={image ? (postStyle === "desktop" ? 2 : 3) : 5}
              maxRows={postStyle === "mobile" ? (image ? 6 : 8) : image ? 5 : 7}
              className={`${
                postStyle === "mobile"
                  ? "p-2 text-sm dark:caret-white"
                  : "py-2 px-3.5 dark:caret-black "
              } cursor-auto caret-black absolute top-0 w-full outline-none h-full resize-none bg-transparent decoration-none text-transparent`}
              style={{
                lineHeight: "1.45rem",
              }}
              onInput={(e) => {
                setPost({
                  ...post,
                  content: e.currentTarget.value,
                });
                adjustInputSize();
              }}
              onScroll={(e) => {
                duplicateTextRef.current!.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
                fakeTextareaRef.current!.scrollTop = e.currentTarget.scrollTop;
              }}
            />
          </div>
        </div>
        <div className="absolute top-0 pointer-events-none">
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
      {image ? <PostImage /> : <OgContent />}
    </>
  );
};

export default PostInput;
