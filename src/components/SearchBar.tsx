import { useState, useRef } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div
        onClick={() => inputRef.current?.focus()}
        className="cursor-text pointer-events-auto z-50 h-10 w-72 max-w-[67.5vw] bg-black/10 dark:bg-white/10 backdrop-blur flex items-center px-4 text-sm rounded-full text-gray-600 dark:text-gray-400 border border-white/25 dark:border-black/25 group"
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
