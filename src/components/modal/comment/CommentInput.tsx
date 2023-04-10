/* eslint-disable @next/next/no-img-element */
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
  useCallback,
  RefObject,
} from "react";
import Link from "next/link";

import TextareaAutosize from "react-textarea-autosize";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";
import useCommentContext from "@/context/commentContext";

// components
import UserAvatarMini from "@/components/UserAvatarMini";

// hooks
import useImage from "@/hooks/useImage";

// types
import FeedUser from "@/types/feedUser";

// libraries
import blobToBase64 from "@/lib/blobToBase64";
import processService from "@/lib/processService";

// types
import Comment from "@/types/comment";

// styles
import styles from "@/styles/scrollbar.module.scss";

interface Props {
  type: "primary comment" | "sub comment";
  comment?: Comment;
  commentInputref?: RefObject<HTMLDivElement>;
}

const CommentInput = ({ type, comment, commentInputref }: Props) => {
  const { feedCache, user, mobile, darkMode } = useGlobalContext();
  const { loading, setLoading } = useModalContext();
  const { post, focused, setFocused } = useCommentContext();

  const {
    image,
    loadImage,
    loadingImage,
    errorLoadingImage,
    removeImage,
    setErrorLoadingImage,
  } = useImage();

  const [commentContent, setCommentContent] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const createPrimaryComment = useCallback(async () => {
    setLoading(true);
    try {
      const base64 = await blobToBase64(image);
      if (!post._id) return;
      const data = await processService("create comment", {
        post_id: post._id,
        content: commentContent,
        image: base64,
      });
      const { comment, success, error } = data;
      if (success && comment) {
        console.log(comment);
        //   setComments((prev) => {
        //     return [commentData, ...prev];
        //   });
        //   setAggregatedData((prev) => {
        //     return {
        //       ...prev,
        //       comments: prev.comments + 1,
        //     };
        //   });
        //   setComment("");
        //   setLoading(false);
        //   setModal(false);
        // console.log(comment);
      } else {
        // if (error === "Unauthorized") {
        //   throw new Error("Unauthorized");
        // } else if (error === "Failed to update user") {
        //   throw new Error("Failed to update user");
        // } else if (error === "Failed to upload image") {
        //   throw new Error("Failed to upload image");
        // } else {
        //   throw new Error("Server error");
        // }
      }
    } catch (error) {
      // alert("Upload error, please try again or a different image :(");
      // setLoading(false);
    }
    setLoading(false);
  }, [commentContent, image, post._id, setLoading]);

  const createSubComment = useCallback(async () => {}, []);

  const createComment = useCallback(async () => {
    if (!post._id || loading || (!commentContent && !image)) return;
    if (type === "primary comment") createPrimaryComment();
    else createSubComment();
  }, [
    commentContent,
    createPrimaryComment,
    createSubComment,
    image,
    loading,
    post._id,
    type,
  ]);

  useEffect(() => {
    const input = imageInputRef.current;
    input?.addEventListener("change", loadImage);
    return () => {
      input?.removeEventListener("change", loadImage);
    };
  }, [loadImage]);

  useEffect(() => {
    if (image)
      imageInputRef.current?.value && (imageInputRef.current.value = "");
  }, [image]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <>
      <input
        onClick={(e) => {
          e.stopPropagation();
        }}
        ref={imageInputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
      />
      <div
        className={`${
          darkMode ? styles.darkScroll : styles.lightScroll
        } py-3 w-full pr-3 flex flex-col`}
      >
        <div className="flex">
          <div className="w-3 h-8 pr-[3px]">
            {type !== "primary comment" && (
              <div className="h-4 w-full border-b-2 border-black/30 animate-fade-in-fast" />
            )}
          </div>
          <UserAvatarMini id={post.user_id!} user={user} extraSmall={true} />
          <div
            onFocus={(e) => {
              setFocused(type === "primary comment" ? post._id : comment?._id);
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFocused(type === "primary comment" ? post._id : comment?._id);
              textareaRef.current?.focus();
            }}
            ref={commentInputref}
            className={`${
              (type === "primary comment"
                ? focused === post._id
                : focused === comment?._id) || textareaRef.current?.value
                ? "bg-white"
                : "bg-gray-50"
            } relative flex-1 min-h-8 rounded-2xl border border-neutral-600/60 cursor-text pl-3 pr-1.5 flex flex-col text-black/80 overflow-hidden transition-all`}
          >
            <TextareaAutosize
              ref={textareaRef}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              minRows={1}
              maxRows={7}
              placeholder={`Write a ${
                type === "primary comment" ? "comment" : "reply"
              }...`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFocused(
                  type === "primary comment" ? post._id : comment?._id
                );
                textareaRef.current?.focus();
              }}
              className={`
        ${
          // if it is scrollable
          (textareaRef.current?.scrollHeight || 0) > 140 &&
          (textareaRef.current?.scrollHeight || 0) >
            (textareaRef.current?.clientHeight || 0)
            ? "overflow-y-scroll"
            : "overflow-hidden"
        }
        ${
          loading ? "animate-pulse" : ""
        } mt-1 outline-none h-full resize-none decoration-none bg-transparent w-full text-sm `}
              style={{
                lineHeight: "1.25rem",
              }}
            />
            <div
              // onClick={() => textareaRef.current?.focus()}
              className={`${
                (type === "primary comment"
                  ? focused === post._id
                  : focused === comment?._id) || textareaRef.current?.value
                  ? "h-6 opacity-100"
                  : "h-0 opacity-0"
              } transition-all ease-out duration-300 flex flex-row-reverse w-full items-center`}
            >
              <i
                onClick={createComment}
                className={`${
                  (type === "primary comment"
                    ? focused === post._id
                    : focused === comment?._id) || textareaRef.current?.value
                    ? "scale-100"
                    : "scale-0"
                } ${
                  textareaRef.current?.value || image
                    ? "text-blue-600 hover:text-blue-500 cursor-pointer"
                    : "text-neutral-600 cursor-not-allowed"
                } ml-2.5 fa-solid fa-share transition-all ease-out duration-200`}
              />
              <i
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  imageInputRef.current?.click();
                }}
                className={`${
                  (type === "primary comment"
                    ? focused === post._id
                    : focused === comment?._id) || textareaRef.current?.value
                    ? "scale-100"
                    : "scale-0"
                } 
          text-black/75 hover:text-blue-500 cursor-pointer fa-solid fa-image transition-all ease-out duration-200`}
              />
            </div>
          </div>
          <div className="h-8 flex items-center">
            <i
              onClick={() => {
                if (image) createComment();
                else imageInputRef.current?.click();
              }}
              className={`${
                (type === "primary comment"
                  ? focused === post._id
                  : focused === comment?._id) || textareaRef.current?.value
                  ? "hidden opacity-0"
                  : "opacity-100 ml-2"
              } 
        ${
          image ? "fa-share text-blue-600" : "fa-image text-black/75"
        } hover:text-blue-500 cursor-pointer fa-solid transition-all ease-out duration-300`}
            />
          </div>
        </div>
        {image && (
          <div
            className="relative flex flex-row-reverse -translate-x-1 mt-3"
            // onClick={() => focused !== comment?._id && setFocused(undefined)}
          >
            <div
              onClick={() => {
                removeImage();
                focused !== comment?._id && setFocused(undefined);
              }}
              className="cursor-pointer absolute -top-2 -right-1.5 h-[1.3rem] w-[1.3rem] bg-white border border-black/30 hover:border-black/50 rounded-full flex justify-center items-center text-[.7rem] text-black/80 hover:text-black  transition-all ease-out duration-300"
            >
              <i className="fa-solid fa-times" />
            </div>
            <img
              src={URL.createObjectURL(image as Blob)}
              alt="preview"
              className={`aspect-square w-16 object-cover object-center rounded-md bg-white select-none border border-black/25`}
              onError={removeImage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CommentInput;
