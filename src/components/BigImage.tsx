/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";

// context
import useGlobalContext from "@/context/globalContext";
import { set } from "lodash";

const BigImage = () => {
  const [image, setImage] = useState("");
  const [closing, setClosing] = useState(false);

  const { bigImage, setBigImage } = useGlobalContext();

  useEffect(() => {
    if (bigImage) {
      setImage(bigImage);
      setClosing(false);
    } else {
      setClosing(true);
      setTimeout(() => {
        setImage("");
      }, 100);
    }
  }, [bigImage]);

  return (
    <>
      <div
        className={`${
          !image && "pointer-events-none"
        } absolute top-0 left-0 w-full h-screen z-[60] flex justify-center items-center`}
      >
        <div
          className={`${
            !image ? "opacity-0" : "opacity-100"
          } absolute top-0 left-0 w-full h-full backdrop-blur-xl`}
          onClick={() => setBigImage("")}
        />
        <div
          className={`${
            !image || closing ? "opacity-0" : "opacity-100"
          } bg-black/50 dark:bg-black/75 w-full h-full flex justify-center items-center transition-all ease-out duration-200`}
        >
          <div className="w-max max-w-[90%] max-h-[90%] flex relative rounded-xl">
            <img
              className="z-10 object-contain rounded-xl border-2 border-black/10 dark:border-white/20"
              src={image}
              alt={image}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BigImage;
