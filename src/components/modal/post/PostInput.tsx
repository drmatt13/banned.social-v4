import { useEffect, useCallback, useRef, useState } from "react";
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
    urlCacheRef,
  } = usePostContext();

  const duplicateTextRef = useRef<HTMLDivElement>(null);
  const fakeTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [previousWord, setPreviousWord] = useState<string>("");

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

  const getWordsAroundCaret = useCallback(() => {
    const caretPosition = getCaretPosition();
    if (caretPosition === undefined || !textareaRef.current) {
      return [undefined, undefined];
    }
    const text = textareaRef.current.value;
    let leftBoundary = caretPosition - 1;
    while (leftBoundary >= 0 && !/\s/.test(text.charAt(leftBoundary))) {
      leftBoundary--;
    }
    const leftWord =
      leftBoundary < caretPosition - 1
        ? text.substring(leftBoundary + 1, caretPosition)
        : undefined;
    let rightBoundary = caretPosition;
    while (
      rightBoundary < text.length &&
      !/\s/.test(text.charAt(rightBoundary))
    ) {
      rightBoundary++;
    }
    const rightWord =
      rightBoundary > caretPosition
        ? text.substring(caretPosition, rightBoundary)
        : undefined;
    return [leftWord, rightWord];
  }, [getCaretPosition, textareaRef]);

  const handlePaste = useCallback(
    (e: any) => {
      const clipboardData = e.clipboardData;
      const text = clipboardData.getData("text");
      const words = text.split(/\s+/);

      const [leftWord, rightWord] = getWordsAroundCaret();
      words[0] = leftWord ? leftWord + words[0] : words[0];
      words[words.length - 1] =
        rightWord && words.length > 1
          ? words[words.length - 1] + rightWord
          : words[words.length - 1];
      for (let i = 0; i < words.length; i++) {
        if (validateUrl(words[i] || "")) {
          processUrl(words[i] || "");
        }
      }
    },
    [getWordsAroundCaret, processUrl]
  );

  const wrapUrlsInSpans = useCallback(
    (text: string) => {
      const words = text.split(/([\s\n]+)/);
      const newWords = words.map((word) => {
        if (validateUrl(word)) {
          return `<span class="${
            postStyle === "mobile"
              ? "dark:text-purple-400 dark:bg-dark-secondary"
              : "dark:text-blue-500"
          } text-blue-500">${word}</span>`;
        } else {
          return word;
        }
      });
      return newWords.join("");
    },
    [postStyle]
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

  const handleKeydown = useCallback(
    (e: any) => {
      if (!e.code || e.ctrlKey || e.metaKey || e.altKey) return;
      setPreviousWord(getCurrentWord() || "");
    },
    [getCurrentWord]
  );

  const handleInput = useCallback(
    (e: any) => {
      const currentWord = getCurrentWord() || "";
      setCaretPosition(getCaretPosition() || 0);
      if (validateUrl(currentWord)) {
        if (urlCacheRef.current[previousWord]) {
          urlCacheRef.current[previousWord]!.inStack = false;
          setOgStack((prev) => prev.filter((url) => url !== previousWord));
        }
        processUrl(currentWord);
      }
    },
    [
      getCaretPosition,
      getCurrentWord,
      previousWord,
      processUrl,
      setCaretPosition,
      setOgStack,
      urlCacheRef,
    ]
  );

  const windowResizeEvent = useCallback(() => {
    setCaretPosition(getCaretPosition() || 0);
    adjustInputSize();
  }, [adjustInputSize, getCaretPosition, setCaretPosition]);

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea?.addEventListener("keydown", handleKeydown);
    textarea?.addEventListener("input", handleInput);
    textarea?.addEventListener("paste", handlePaste);
    window.addEventListener("resize", windowResizeEvent);
    return () => {
      textarea?.removeEventListener("keydown", handleKeydown);
      textarea?.removeEventListener("input", handleInput);
      textarea?.removeEventListener("paste", handlePaste);
      window.removeEventListener("resize", windowResizeEvent);
    };
  }, [
    getCaretPosition,
    handleInput,
    handleKeydown,
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
              className={`${loading ? "animate-pulse" : ""} ${
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
              className={`${loading ? "animate-pulse" : ""} ${
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
              className={`
              ${loading ? "animate-pulse" : ""}
              ${
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
              disabled={loading}
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
