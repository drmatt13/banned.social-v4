/* eslint-disable @next/next/no-img-element */
import { useState, useCallback, useEffect, useRef } from "react";

// components
import BigSubmitButton from "@/components/BigSubmitButton";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";

// libaries
import processService from "@/lib/processService";

const UploadImage = ({
  image,
  loadImage,
  loadingImage,
  removeImage,
  errorLoadingImage,
}: {
  image: string;
  loadImage: (e: unknown) => void;
  loadingImage: boolean;
  removeImage: () => void;
  errorLoadingImage: boolean;
}) => {
  const { setUser, logout } = useGlobalContext();
  const { setModal, loading, setLoading } = useModalContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const uploadImage = useCallback(async () => {
    if (!image) return;
    setLoading(true);
    try {
      const data = await processService("update avatar", {
        avatar: image,
      });
      const { user, success, error } = data;
      if (success && user) {
        setUser({
          ...user,
          avatar: user.avatar,
        });
        setLoading(false);
        setModal(false);
      } else {
        if (error === "Unauthorized") {
          throw new Error("Unauthorized");
        } else if (error === "Failed to update user") {
          throw new Error("Failed to update user");
        } else if (error === "Failed to upload image") {
          throw new Error("Failed to upload image");
        } else {
          throw new Error("Server error");
        }
      }
    } catch (error) {
      alert("Upload error, please try again or a different image :(");
      setLoading(false);
    }
  }, [image, setLoading, setModal, setUser]);

  useEffect(() => {
    const input = inputRef.current;
    input?.addEventListener("change", loadImage);
    return () => {
      input?.removeEventListener("change", loadImage);
    };
  }, [loadImage]);

  useEffect(() => {
    if (image) inputRef.current?.value && (inputRef.current.value = "");
  }, [image]);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
    }
  }, [initialLoad]);

  return (
    <div className="h-full flex flex-col">
      <div className={`flex-1 flex flex-col justify-center`}>
        <div
          className={`${
            !image && "px-8 flex-col items-center justify-evenly flex-1"
          } ${initialLoad && "hidden"} flex my-8`}
        >
          <div
            ref={dropRef}
            onDrag={
              !loadingImage
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                : undefined
            }
            onDragOver={
              !loadingImage
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                : undefined
            }
            onDragLeave={
              !loadingImage
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                : undefined
            }
            onDrop={
              !loadingImage
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    loadImage(e);
                  }
                : undefined
            }
            className={`${
              image
                ? "flex-1 items-end"
                : "justify-evenly items-center border-dashed border-2 aspect-video bg-gray-200 dark:bg-white/30 cursor-pointer"
            } flex flex-col max-w-full h-full border-blue-400 dark:border-blue-600 rounded-lg`}
            onTouchEnd={() => !image && inputRef.current?.click()}
            onClick={() => !image && inputRef.current?.click()}
          >
            {image ? (
              <div
                className={`${
                  loading && "grayscale-[.75] cursor-not-allowed"
                } bg-blue-500 dark:bg-blue-600 p-1 rounded-lg mx-2 aspect-square`}
              >
                <img
                  src={image}
                  alt="preview"
                  className={`aspect-square w-48 object-cover object-center rounded-md bg-white select-none`}
                  onError={removeImage}
                />
              </div>
            ) : (
              <>
                <i className="fa-regular fa-images text-5xl text-blue-500 dark:text-blue-600" />
                <div className="text-xs text-gray-700 select-none">
                  drag & drop your image here
                </div>
              </>
            )}
          </div>
          <div className="flex-1 flex justify-center">
            <div
              className={`${
                image
                  ? "flex flex-col flex-1 mx-2 relative"
                  : "w-48 xs:w-64 mt-4 flex items-center justify-end"
              }`}
            >
              <div className={`${image && "w-full absolute bottom-0"}`}>
                <button
                  className={`${
                    loading || false
                      ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300 cursor-not-allowed"
                      : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
                  } ${
                    image ? "rounded-full flex-1" : "rounded-lg translate-x-1"
                  } px-4 py-2 text-center select-none w-full text-xs xs:text-sm truncate`}
                  onClick={() => inputRef.current?.click()}
                  disabled={loading}
                >
                  Select Image
                </button>
                <button
                  className={`${
                    loading || false
                      ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300 cursor-not-allowed"
                      : "bg-red-700/90 dark:bg-red-700/80 text-white hover:bg-red-600/90 dark:hover:bg-red-600/80 cursor-pointer"
                  } ${
                    image ? "rounded-full flex-1" : " hidden"
                  } px-4 py-2 text-center mt-2 select-none w-full text-xs xs:text-sm truncate`}
                  onClick={removeImage}
                  disabled={loading}
                >
                  Remove Image
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BigSubmitButton
        disabled={loading || !image}
        onClick={uploadImage}
        value="Upload Image"
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
      />
    </div>
  );
};

export default UploadImage;
