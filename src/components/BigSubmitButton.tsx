// context
import useGlobalContext from "@/context/globalContext";

interface Props {
  value: string;
  onClick: (e: any) => any;
  disabled: boolean;
}

const BigSubmitButton = ({ value, onClick, disabled }: Props) => {
  const { user } = useGlobalContext();

  return (
    <button
      className={`${
        disabled
          ? `${
              user?.avatar
                ? "bg-stone-500/20 dark:bg-neutral-500/30 text-black/80"
                : "bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300"
            } border-light-border dark:border-dark-border cursor-not-allowed`
          : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
      }  mx-2 mb-2 py-2 rounded-full select-none`}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
};

export default BigSubmitButton;
