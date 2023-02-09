import useGlobalContext from "@/context/globalContext";

const ToggleDarkModeButton = () => {
  const { darkMode, toggleDarkMode, mobile } = useGlobalContext();
  return (
    <div className="z-50 top-0 h-28 w-full absolute py-8 pr-8 flex flex-row-reverse noselect pointer-events-none select-none">
      <div className="w-10 h-10">
        <i
          onClick={toggleDarkMode}
          className={`${
            mobile
              ? "active:scale-90 active:bg-black/75"
              : "hover:scale-90 hover:bg-black/75"
          } pointer-events-auto fa-solid bg-black/50 cursor-pointer transition-all text-lg flex justify-center items-center h-full w-full rounded-full 
            ${
              darkMode
                ? "fa-moon text-purple-500 active:text-purple-400"
                : "fa-sun text-orange-400 /active:text-yellow-400"
            }`}
        />
      </div>
    </div>
  );
};

export default ToggleDarkModeButton;
