// context
import useGlobalContext from "@/context/globalContext";

interface Props {
  radius?:
    | "rounded-sm"
    | "rounded-md"
    | "rounded-lg"
    | "rounded-xl"
    | "rounded-2xl"
    | "rounded-full";
  value: string;
  onClick?: (e: any) => any;
  disabled: boolean;
  customDarkDisabled?: boolean;
}

const BigSubmitButton = ({
  radius,
  value,
  onClick,
  disabled,
  customDarkDisabled = false,
}: Props) => {
  const { user, mobile } = useGlobalContext();

  return (
    <button
      className={`
      ${radius || "rounded-full"} ${
        disabled
          ? `${
              user?.avatar
                ? `${
                    customDarkDisabled
                      ? "dark:bg-neutral-500/[45%] text-black/95"
                      : "dark:bg-neutral-500/30 text-black/80"
                  } bg-stone-500/20 `
                : "bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300"
            } border-light-border dark:border-dark-border cursor-not-allowed`
          : `${
              mobile
                ? "active:bg-blue-600 dark:active:bg-blue-500"
                : "hover:bg-blue-600 dark:hover:bg-blue-500"
            } bg-blue-500 dark:bg-blue-600 text-white cursor-pointer transition-colors ease-out`
      } mx-2 mb-2 py-2 select-none`}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
};

export default BigSubmitButton;
