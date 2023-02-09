import { useState, useRef } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div
        onClick={() => inputRef.current?.focus()}
        className="cursor-text pointer-events-auto z-50 h-10 w-72 max-w-[67.5vw] bg-white/10 dark:bg-white/10 hover:bg-white/25 focus-within:bg-white/25 dark:hover:bg-white/[15%] dark:focus-within:bg-white/[15%] backdrop-blur backdrop-grayscale-[50%] dark:backdrop-grayscale-0 backdrop-brightness-110 dark:backdrop-brightness-75 flex items-center px-4 text-sm rounded-full text-black/75 dark:text-gray-300 border border-black/10 hover:border-black/25 focus-within:border-black/25 dark:border-black/25 dark:hover:border-white/10 dark:focus-within:border-white/10 transition-colors duration-300 ease-out group"
      >
        <i className="fa-solid fa-magnifying-glass transition-colors duration-300 ease-out group-hover:text-black group-focus-within:text-black dark:group-hover:text-white dark:group-focus-within:text-white" />
        <input
          ref={inputRef}
          className="bg-black/0 outline-none w-full ml-2 transition-colors duration-300 ease-out group-hover:text-black group-focus-within:text-black dark:group-hover:text-white dark:group-focus-within:text-white"
          type="text"
          value={search}
          onChange={(e) => setSearch(() => e.target.value)}
        />
        <div className="pointer-events-none absolute left-10 transition-colors duration-300 ease-out group-hover:text-black dark:group-hover:text-white group-focus-within:!text-black/0 group-focus-within:!transition-none">
          {search.length === 0 && "Search"}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
