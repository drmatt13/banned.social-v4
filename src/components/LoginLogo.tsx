import glitch from "@/styles/glitch.module.scss";

const LoginLogo = () => {
  return (
    <div className="z-50 flex flex-col items-center">
      <div
        className={`${glitch.login_header} mt-28 lg:mt-32 xl:mt-36 select-none font-mono text-4xl sm:text-[2.5rem] md:text-5xl xl:text-6xl /xl:w-[26.75rem] hue-rotate-90 dark:hue-rotate-0`}
      >
        <div
          className={`${glitch.text} text-gray-200 dark:text-white invert dark:invert-0`}
          data-text="Banned Social"
        >
          Banned Social
        </div>
      </div>
    </div>
  );
};

export default LoginLogo;
