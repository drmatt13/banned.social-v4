import { useState, useCallback, useEffect } from "react";

import Resizer from "react-image-file-resizer";
import isBase64 from "is-base64";

const isChangeEvent = (
  e: unknown
): e is React.ChangeEvent<HTMLInputElement> => {
  return (e as React.ChangeEvent<HTMLInputElement>).target !== undefined;
};

const isDragEvent = (e: unknown): e is React.DragEvent<HTMLDivElement> => {
  return (e as React.DragEvent<HTMLDivElement>).dataTransfer !== undefined;
};

function isValidImageFile(file: File): boolean {
  const validImageTypes = ["image/png", "image/jpeg"];
  return validImageTypes.includes(file.type);
}

const useImage = () => {
  const [loadingImage, setLoadingImage] = useState(false);
  const [image, setImage] = useState("");
  const [errorLoadingImage, setErrorLoadingImage] = useState(false);

  const loadImage = useCallback((e: unknown) => {
    (e as Event).preventDefault();
    setLoadingImage(true);
    setErrorLoadingImage(false);
    let image: File | undefined;
    if (isChangeEvent(e)) image = e.target.files?.[0];
    if (isDragEvent(e)) image = e.dataTransfer?.files?.[0];
    if (!image || !isValidImageFile(image)) {
      return setErrorLoadingImage(true);
    }
    const reader = new FileReader();
    reader.onloadend = async (e: ProgressEvent<FileReader>) => {
      const processedImage = await new Promise<
        string | Blob | File | ProgressEvent<FileReader>
      >((resolve) => {
        Resizer.imageFileResizer(
          image!,
          1024,
          1024,
          "JPEG",
          50,
          0,
          (uri) => {
            resolve(uri);
          },
          "base64"
        );
      });
      if (
        typeof processedImage !== "string" ||
        !isBase64(processedImage, { mimeRequired: true })
      ) {
        return setErrorLoadingImage(true);
      }
      console.log(processedImage);
      setImage(processedImage);
      setLoadingImage(false);
    };
    reader.onerror = (e: ProgressEvent<FileReader>) => {
      return setErrorLoadingImage(true);
    };
    reader.readAsDataURL(image);
  }, []);

  useEffect(() => {
    if (errorLoadingImage) {
      setImage("");
      setLoadingImage(false);
    }
  }, [errorLoadingImage]);

  return {
    image,
    loadImage,
    loadingImage,
    removeImage: () => setImage(""),
    errorLoadingImage,
    setErrorLoadingImage,
  };
};

export default useImage;
