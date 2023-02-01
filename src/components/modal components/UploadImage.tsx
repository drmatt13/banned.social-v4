/* eslint-disable @next/next/no-img-element */
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  DetailedHTMLProps,
  ImgHTMLAttributes,
} from "react";

// context
// import { useGlobalContext } from "@/context/globalContext";

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
  // const { mobile } = useGlobalContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const assessFile = useCallback(
    (file: File | undefined | null) => {
      if (file?.type.match(/image.*/)) {
        setImage(file);
      }
    },
    [setImage]
  );

  const processImage = useCallback((image: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(image);
  }, []);

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
    const dropContainerCallback = (e: DragEvent) =>
      assessFile(e.dataTransfer?.files[0]);
    const inputCallback = () => assessFile(input.files && input.files[0]);
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
  }, [assessFile]);

  return (
    <div className="h-full flex flex-col">
      <div className={`flex-1 flex flex-col justify-center`}>
        <div
          className={`${
            !preview && "px-8 flex-col items-center justify-evenly flex-1"
          } flex my-8`}
        >
          <div
            ref={dropRef}
            className={`${
              preview
                ? "flex-1 items-end"
                : "justify-evenly items-center border-dashed border-2 aspect-video bg-gray-200 dark:bg-white/30"
            } flex flex-col max-w-full h-full border-blue-400 dark:border-blue-600 rounded-lg`}
            onTouchEnd={() => !preview && inputRef.current?.click()}
          >
            {preview ? (
              <div className="bg-blue-500 dark:bg-blue-600 p-1 rounded-lg mx-2 aspect-square">
                <img
                  src={
                    preview as unknown as DetailedHTMLProps<
                      ImgHTMLAttributes<HTMLImageElement>,
                      HTMLImageElement
                    >["src"]
                  }
                  alt="preview"
                  className="aspect-square w-48 /h-48 object-cover rounded-md bg-white"
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
                  : "w-64 mt-4 flex items-center justify-end"
              }`}
            >
              <div className={`${preview ? "w-full absolute bottom-0" : ""}`}>
                <div
                  className={`${
                    loading || false
                      ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300 cursor-not-allowed"
                      : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
                  } ${
                    preview ? "rounded-full flex-1" : "rounded-lg translate-x-1"
                  } px-4 py-2 text-center select-none`}
                  onClick={() => inputRef.current?.click()}
                >
                  Select Image
                </div>
                <div
                  className={`${
                    loading || false
                      ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300 cursor-not-allowed"
                      : "bg-red-700/90 dark:bg-red-800/75 text-white hover:bg-red-600/90 dark:hover:bg-red-600/80 cursor-pointer"
                  } ${
                    preview ? "rounded-full flex-1" : " hidden"
                  } px-4 py-2 text-center mt-2 select-none`}
                  onClick={() => setImage(undefined)}
                >
                  Remove Image
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className={`${
          loading || !image
            ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300 cursor-not-allowed"
            : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
        }  mx-2 mb-2 py-2 rounded-full select-none`}
        // onClick={() => inputRef.current?.click()}
        disabled={loading || !image}
      >
        Upload Image
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" />
    </div>
  );
};

export default UploadImage;
