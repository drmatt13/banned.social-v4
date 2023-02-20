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
    setImage,
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
        <div className="px-2 mb-3 h-20">
          <div
            className={`${
              postStyle === "mobile"
                ? "dark:bg-white/[15%] dark:border-black/40 shadow"
                : "dark:bg-white/40 dark:border-black/[17.5%]"
            } relative p-2 flex bg-white/50 border border-black/[17.5%] w-full h-full rounded cursor-default hover:bg-gray-100 dark:hover:bg-white/50 select-none`}
          >
            <div
              className={`${
                mobile
                  ? "active:bg-red-400 dark:active:bg-white"
                  : "hover:bg-red-400 dark:hover:bg-white"
              } bg-white/80 absolute h-5 w-5 -top-1.5 -right-1.5 rounded-full p-2 flex justify-center items-center cursor-pointer border shadow pointer-events-auto transition-colors ease-out`}
              onClick={() => setOgStack(removeLastIndex(ogStack))}
            >
              <i className="fas fa-times text-xs text-gray-800 w-5 h-5 flex justify-center items-center" />
            </div>
            {post.og.image && (
              <div className="w-14 h-9 bg-black/10 dark:bg-black/[15%] mr-2 border border-black/[12.5%] dark:border-black/[17.5%]">
                <img
                  className="w-full h-full  object-cover"
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
