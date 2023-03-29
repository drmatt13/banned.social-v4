import { useCallback, useEffect, useRef, useState } from "react";

// components
import UserAvatarMini from "@/components/UserAvatarMini";

// context
import useGlobalContext from "@/context/globalContext";
import useOnlineFriendsContext from "@/context/onlineFriendsContext";

// types
import type User from "@/types/user";

// styles
import styles from "@/styles/scrollbar.module.scss";

const Contacts = () => {
  const { darkMode, mobile, isFirefox } = useGlobalContext();
  const {
    onlineFriends,
    onlineFriendsScrollPosition,
    setOnlineFriendsScrollPosition,
  } = useOnlineFriendsContext();

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollChildRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const contentContainerScroll = useCallback(() => {
    if (!scrollRef.current || !contentRef.current) return;
    scrollRef.current.scrollTo(0, contentRef.current.scrollTop);
    setOnlineFriendsScrollPosition(contentRef.current.scrollTop);
  }, [setOnlineFriendsScrollPosition]);

  const scrollContainerScroll = useCallback(() => {
    if (!scrollRef.current || !contentRef.current) return;
    contentRef.current.scrollTo(0, scrollRef.current.scrollTop);
    setOnlineFriendsScrollPosition(scrollRef.current.scrollTop);
  }, [setOnlineFriendsScrollPosition]);

  const addScrollListenerToContentContainer = useCallback(() => {
    scrollRef.current?.removeEventListener("scroll", scrollContainerScroll);
    contentRef.current?.removeEventListener("scroll", contentContainerScroll);
    contentRef.current?.addEventListener("scroll", contentContainerScroll);
  }, [contentContainerScroll, scrollContainerScroll]);

  const addScrollListenerToScrollContainer = useCallback(() => {
    contentRef.current?.removeEventListener("scroll", contentContainerScroll);
    scrollRef.current?.removeEventListener("scroll", scrollContainerScroll);
    scrollRef.current?.addEventListener("scroll", scrollContainerScroll);
  }, [contentContainerScroll, scrollContainerScroll]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const scrollChild = scrollChildRef.current;
    const contentContainer = contentRef.current;
    if (scrollContainer && contentContainer && scrollChild) {
      scrollChild.style.height = `${contentContainer.scrollHeight}px`;
      scrollContainer.scrollTo(0, onlineFriendsScrollPosition);
      contentContainer.scrollTo(0, onlineFriendsScrollPosition);
    }
  }, [onlineFriendsScrollPosition]);

  useEffect(() => {
    addScrollListenerToContentContainer();
  }, [addScrollListenerToContentContainer]);

  return (
    <>
      <div className={`w-full relative flex flex-row-reverse group`}>
        {!mobile && (
          <div
            className={`${
              darkMode ? styles.darkScroll : styles.lightScrollGray
            } h-full`}
          >
            <div
              className={`${
                !isFirefox && "group-hover:opacity-100"
              } overflow-auto h-full w-[7px] opacity-0 transition-opacity ease-out`}
              ref={scrollRef}
              onFocus={addScrollListenerToScrollContainer}
              onBlur={addScrollListenerToContentContainer}
              onMouseEnter={addScrollListenerToScrollContainer}
              onTouchStart={addScrollListenerToScrollContainer}
            >
              <div ref={scrollChildRef} className="h-screen /w-3" />
            </div>
          </div>
        )}
        <div className={`${!mobile && styles.hideScroll} w-full h-full`}>
          <div
            ref={contentRef}
            className={`overflow-y-scroll w-full h-full`}
            onFocus={addScrollListenerToContentContainer}
            onBlur={addScrollListenerToScrollContainer}
            onMouseEnter={addScrollListenerToContentContainer}
            onTouchStart={addScrollListenerToContentContainer}
          >
            <div className="flex flex-col mb-1.5">
              <div className="text-md px-2 mb-3 font-bold text-black/80 dark:text-white/90">
                Contacts
              </div>
              {onlineFriends.map((user, i) => (
                <div
                  key={user?._id || i}
                  className="flex items-center px-2 py-1.5 rounded-l-lg cursor-pointer hover:bg-light-secondary hover:dark:bg-dark-secondary transition-colors ease-out duration-150"
                >
                  <UserAvatarMini
                    id="0"
                    user={{ avatar: user?.avatar } as User}
                  />
                  <div>{user?.username}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;
