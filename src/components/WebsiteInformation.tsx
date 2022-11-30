import Link from "next/link";

const WebsiteInformation = () => {
  return (
    <div className="text-sm md:absolute my-8 md:my-0 top-0 left-0 p-3 dark:text-gray-200 w-44 flex flex-col">
      <div className="mb-1 font-bold">Premade Test Account:</div>
      <div className="flex">
        <div className="flex-1">Username:</div>
        <div className="flex-1 text-purple-500 dark:text-yellow-400">
          testuser
        </div>
      </div>
      <div className="flex">
        <div className="flex-1">Password:</div>
        <div className="flex-1 text-purple-500 dark:text-yellow-400">
          password
        </div>
      </div>

      <div className="mt-5 mb-1 font-bold">Website Design:</div>
      <Link
        legacyBehavior={true}
        href="https://github.com/drmatt13/social-template---Next.js-NextAuth.js-MongoDB-Tailwind"
      >
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          Git Repository
        </a>
      </Link>
      <Link legacyBehavior={true} href="/middleware.svg">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          Middleware
        </a>
      </Link>
      <Link legacyBehavior={true} href="/eventbus.svg">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          Eventbus
        </a>
      </Link>
      <Link legacyBehavior={true} href="/standardlogin.svg">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          Standard login
        </a>
      </Link>
      <Link legacyBehavior={true} href="/oauthlogin.svg">
        <a className="cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          OAuth login
        </a>
      </Link>
      <div className="mt-5 mb-1 font-bold">Test Routes:</div>
      <Link legacyBehavior={true} href="/unprotected">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          Unprotected Route
        </a>
      </Link>
      <Link legacyBehavior={true} href="/protected">
        <a className="cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          Protected Route
        </a>
      </Link>

      <div className="mt-5 mb-1 font-bold">My Portfolio</div>
      <Link legacyBehavior={true} href="https://portfolio-min.vercel.app/">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          Matthew Sweeney
        </a>
      </Link>
    </div>
  );
};

export default WebsiteInformation;
