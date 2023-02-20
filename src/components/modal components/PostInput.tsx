/* eslint-disable @next/next/no-img-element */
import { useEffect, useCallback, useRef, useDeferredValue } from "react";
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
}

const PostInput = ({ textareaRef, caretPosition, setCaretPosition }: Props) => {
  const { user, mobile } = useGlobalContext();
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
    removeImage,
    processUrl,
    postStyle,
  } = usePostContext();

  const duplicateTextRef = useRef<HTMLDivElement>(null);
  const fakeTextareaRef = useRef<HTMLTextAreaElement>(null);
  // const linkText = useDeferredValue(post.content);

  const adjustPWidth = useCallback(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const p = duplicateTextRef.current;
    if (!p) return;
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
    adjustPWidth();
  }, [adjustPWidth, getCaretPosition, setCaretPosition]);

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
    adjustPWidth();
  }, [
    adjustPWidth,
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
      <div className={`relative mb-3 flex flex-col overflow-hidden w-full`}>
        {/* *********************************************************************************************** */}
        <TextareaAutosize
          ref={fakeTextareaRef}
          value={post.content}
          minRows={5}
          maxRows={postStyle === "mobile" ? 8 : 7}
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
          minRows={5}
          maxRows={postStyle === "mobile" ? 8 : 7}
          className={`${
            postStyle === "mobile"
              ? "p-2 text-sm dark:caret-white"
              : "py-2 px-3.5 dark:caret-black "
          } caret-black absolute top-0 w-full outline-none h-full resize-none bg-transparent decoration-none text-transparent`}
          style={{
            lineHeight: "1.45rem",
          }}
          onInput={(e) => {
            setPost({
              ...post,
              content: e.currentTarget.value,
            });
            adjustPWidth();
          }}
          onScroll={(e) => {
            duplicateTextRef.current!.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
            fakeTextareaRef.current!.scrollTop = e.currentTarget.scrollTop;
          }}
        />
        {/* *********************************************************************************************** */}
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
      {loadingOg && ogStack.length === 0 && (
        <div className="relative px-2 mb-3 h-20 w-full">
          <Loading />
        </div>
      )}
      {ogStack.length !== 0 && (post.og?.title || post.og?.description) && (
        <div className="relative px-2 mb-3 h-20 select-none">
          <div
            className={`${
              mobile
                ? "active:bg-red-400 dark:active:bg-white"
                : "hover:bg-red-400 dark:hover:bg-white"
            } ${
              postStyle === "desktop"
                ? "dark:border-neutral-400 dark:hover:border-black/40 border-black/25 bg-white dark:bg-neutral-100 right-0.5"
                : "bg-white dark:bg-neutral-300 right-1"
            } border border-neutral-400 hover:border-none dark:hover:border-solid absolute h-5 w-5 -top-2 rounded-full p-2 flex justify-center items-center cursor-pointer pointer-events-auto transition-colors ease-out`}
            onClick={() => setOgStack(removeLastIndex(ogStack))}
          >
            <i className="fas fa-times text-xs text-gray-800 dark:text-black/90 w-5 h-5 flex justify-center items-center" />
          </div>
          <div
            className={`${
              postStyle === "mobile"
                ? `${
                    mobile
                      ? "active:bg-gray-200/75 dark:active:bg-white/20"
                      : "hover:bg-gray-200/75 dark:hover:bg-white/20"
                  } bg-gray-100/50 dark:bg-white/[15%] dark:border-black/40 shadow`
                : `${
                    mobile
                      ? "active:bg-gray-400/40 dark:active:bg-white/60"
                      : "hover:bg-gray-400/40 dark:hover:bg-white/60"
                  } bg-gray-300/80 dark:bg-white/40 dark:border-black/[17.5%]`
            } p-2 flex border border-black/[17.5%] w-full h-full rounded cursor-default select-none transition-colors ease-out`}
          >
            {post.og.image?.url && (
              <img
                className="mr-2.5 shadow h-9 aspect-video object-cover rounded-sm"
                src={post.og.image.url}
                alt={post.og.title || post.og.title || "og image"}
              />
            )}
            <div
              className="flex flex-col flex-1 justify-start overflow-hidden"
              style={{
                fontSize: "0.8rem",
              }}
            >
              <div className="flex-1 truncate">{post.og.siteName}</div>
              <div className="flex-1 font-bold truncate">{post.og.title}</div>
              {post.og.description && (
                <div className="flex-1 truncate">{post.og.description}</div>
              )}
              {post.og.url && !post.og.siteName && (
                <div className="flex-1 truncate">
                  {decodeURI(post.og.url || "")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostInput;
