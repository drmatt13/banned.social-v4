/* eslint-disable @next/next/no-img-element */
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  DetailedHTMLProps,
  ImgHTMLAttributes,
} from "react";

import Resizer from "react-image-file-resizer";
import isBase64 from "is-base64";

// components
import BigSubmitButton from "@/components/BigSubmitButton";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";

// libaries
import { processService, serviceError } from "@/lib/processService";

const UploadImage = ({
  image,
  setImage,
  loading,
  setLoading,
}: {
  image: File | undefined;
  setImage: (image: File | undefined) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const { setUser, logout } = useGlobalContext();
  const { setModal } = useModalContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [initialLoad, setInitialLoad] = useState(true);

  const assessFile = useCallback(
    (file: File | undefined | null) => {
      if (file?.type === "image/png" || file?.type === "image/jpeg") {
        setImage(file);
      }
    },
    [setImage]
  );

  const resizeFile = useCallback(
    (file: File) =>
      new Promise<string | Blob | File | ProgressEvent<FileReader>>(
        (resolve) => {
          Resizer.imageFileResizer(
            file,
            960,
            960,
            "JPEG",
            80,
            0,
            (uri) => {
              resolve(uri);
            },
            "base64"
          );
        }
      ),
    []
  );

  const uploadImage = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (!image) return;
      setLoading(true);
      const base64 = await resizeFile(image);
      if (
        typeof base64 !== "string" ||
        !isBase64(base64, { mimeRequired: true })
      ) {
        alert("Error resizing image");
        setLoading(false);
        return;
      }
      try {
        const data = await processService("update avatar", {
          avatar: base64,
        });
        const { user, success, error } = data;
        if (success && user) {
          setUser({
            ...user,
            avatar: user.avatar + "#" + new Date().getTime(),
          });
          setModal(false);
        } else {
          if (error === serviceError.Unauthorized) {
            throw new Error(serviceError.Unauthorized);
          } else if (error === serviceError.FailedToUpdateUser) {
            throw new Error(serviceError.FailedToUpdateUser);
          } else {
            throw new Error(serviceError.ServerError);
          }
        }
      } catch (error) {
        alert("Server error");
        logout();
      }
    },
    [image, logout, resizeFile, setLoading, setModal, setUser]
  );

  const processImage = useCallback(
    (image: File) => {
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        setPreview(e.target.result);
      };
      reader.onerror = (e) => {
        setPreview(undefined);
        setImage(undefined);
        alert("Error loading image");
      };
      reader.readAsDataURL(image);
    },
    [setImage]
  );

  useEffect(() => {
    if (image) {
      processImage(image);
    } else {
      setPreview(undefined);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [image, processImage]);

  useEffect(() => {
    if (!dropRef.current || !inputRef.current) return;
    const dropContainer = dropRef.current;
    const input = inputRef.current;
    const dropContainerCallback = (e: DragEvent) => {
      if (loading) return;
      assessFile(e.dataTransfer?.files[0]);
    };
    const inputCallback = () => {
      if (loading) return;
      assessFile(input.files && input.files[0]);
    };
    const preventDefault = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    dropContainer.addEventListener("dragenter", preventDefault, false);
    dropContainer.addEventListener("dragleave", preventDefault, false);
    dropContainer.addEventListener("dragover", preventDefault, false);
    dropContainer.addEventListener("drop", preventDefault, false);
    dropContainer.addEventListener("drop", dropContainerCallback, false);
    input.onchange = inputCallback;
    return () => {
      if (!dropContainer || !input) return;
      dropContainer.removeEventListener("dragenter", preventDefault, false);
      dropContainer.removeEventListener("dragleave", preventDefault, false);
      dropContainer.removeEventListener("dragover", preventDefault, false);
      dropContainer.removeEventListener("drop", preventDefault, false);
      dropContainer.removeEventListener("drop", dropContainerCallback, false);
      input.onchange = null;
    };
  }, [assessFile, loading]);

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
            !preview && "px-8 flex-col items-center justify-evenly flex-1"
          } ${initialLoad && "hidden"} flex my-8`}
        >
          <div
            ref={dropRef}
            className={`${
              preview
                ? "flex-1 items-end"
                : "justify-evenly items-center border-dashed border-2 aspect-video bg-gray-200 dark:bg-white/30 cursor-pointer"
            } flex flex-col max-w-full h-full border-blue-400 dark:border-blue-600 rounded-lg`}
            onTouchEnd={() => !preview && inputRef.current?.click()}
            onClick={() => !preview && inputRef.current?.click()}
          >
            {preview ? (
              <div
                className={`${
                  loading && "grayscale-[.75] cursor-not-allowed"
                } bg-blue-500 dark:bg-blue-600 p-1 rounded-lg mx-2 aspect-square`}
              >
                <img
                  src={
                    preview as unknown as DetailedHTMLProps<
                      ImgHTMLAttributes<HTMLImageElement>,
                      HTMLImageElement
                    >["src"]
                  }
                  alt="preview"
                  className={`aspect-square w-48 object-cover object-center rounded-md bg-white select-none`}
                  onError={() => {
                    setPreview(undefined);
                    setImage(undefined);
                    alert("Error loading image");
                  }}
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
                preview
                  ? "flex flex-col flex-1 mx-2 relative"
                  : "w-48 xs:w-64 mt-4 flex items-center justify-end"
              }`}
            >
              <div className={`${preview && "w-full absolute bottom-0"}`}>
                <button
                  className={`${
                    loading || false
                      ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300 cursor-not-allowed"
                      : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
                  } ${
                    preview ? "rounded-full flex-1" : "rounded-lg translate-x-1"
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
                    preview ? "rounded-full flex-1" : " hidden"
                  } px-4 py-2 text-center mt-2 select-none w-full text-xs xs:text-sm truncate`}
                  onClick={() => setImage(undefined)}
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
