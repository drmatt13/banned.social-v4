import { useCallback, useEffect, useRef, useState } from "react";

// context
import useGlobalContext from "@/context/globalContext";
import useOnlineFriendsContext from "@/context/onlineFriendsContext";

// styles
import styles from "@/styles/scrollbar.module.scss";

interface Props {
  children: React.ReactNode;
}

const ContactsVanishingScroll = ({ children }: Props) => {
  const { darkMode, mobile, isFirefox } = useGlobalContext();
  const {
    onlineFriends,
    onlineFriendsScrollPosition,
    setOnlineFriendsScrollPosition,
  } = useOnlineFriendsContext();

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollChildRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [initialLoad, setInitialLoad] = useState(true);

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
      scrollChild.style.height = `${contentContainer.scrollHeight - 5}px`;
      scrollContainer.scrollTo(0, onlineFriendsScrollPosition);
      contentContainer.scrollTo(0, onlineFriendsScrollPosition);
    }
    setInitialLoad(false);
  }, [onlineFriendsScrollPosition]);

  useEffect(() => {
    addScrollListenerToContentContainer();
  }, [addScrollListenerToContentContainer]);

  return (
    <>
      <div
        className={`w-full relative flex flex-row-reverse group`}
        style={{
          opacity: initialLoad ? 0 : 1,
        }}
      >
        {!mobile && (
          <div
            className={`${
              darkMode ? styles.darkScrollAlt : styles.lightScrollGray
            } h-full `}
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
              <div ref={scrollChildRef} className="h-screen w-0" />
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
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactsVanishingScroll;
