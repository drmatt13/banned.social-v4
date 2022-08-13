import Link from "next/link";

const WebsiteInformation = () => {
  return (
    <div className="text-sm md:absolute my-8 md:my-0 top-0 left-0 p-3 dark:text-gray-200 w-44 flex flex-col">
      <div className="mb-1 underline">test account:</div>
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
      <div className="mt-5 mb-1 underline">Git Repository:</div>
      <Link href="https://github.com/drmatt13/social-template---Next.js-NextAuth.js-MongoDB-Tailwind">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          social template
        </a>
      </Link>
      <div className="mt-5 mb-1 underline">Website Design:</div>
      <Link href="/middleware.svg">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          middleware
        </a>
      </Link>
      <Link href="/eventbus.svg">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          eventbus
        </a>
      </Link>
      <Link href="/standardlogin.svg">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          standard login
        </a>
      </Link>
      <Link href="/oauthlogin.svg">
        <a className="cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          OAuth login
        </a>
      </Link>
      <div className="mt-5 mb-1 underline">Test Routes:</div>
      <Link href="/unprotected">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          unprotected route
        </a>
      </Link>
      <Link href="/protected">
        <a className="cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          protected route
        </a>
      </Link>

      <div className="mt-5 mb-1 underline">My Portfolio</div>
      <Link href="https://portfolio-min.vercel.app/">
        <a className="mb-1 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap">
          Matthew Sweeney
        </a>
      </Link>
    </div>
  );
};

export default WebsiteInformation;
