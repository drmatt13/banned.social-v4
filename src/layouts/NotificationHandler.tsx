import { useState, useEffect, useCallback, useRef } from "react";

interface Props {
  children: React.ReactNode;
}

// components
import Notification from "@/components/Notification";

// context
import useGlobalContext from "@/context/globalContext";

type Notifications = any;

const minutesToMilliseconds = (minutes: number) => minutes * 60 * 1000;

const NotificationHandler = ({ children }: Props) => {
  const { user } = useGlobalContext();

  const activityTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);

  const socketFlag = useRef(false);
  const pingTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

  const [notifications, setNotifications] = useState<Notifications>([]);

  const removeSocket = useCallback(() => {
    if (!socket || !socketFlag.current) return;
    console.log("Removing socket");
    clearTimeout(activityTimer.current);
    clearTimeout(pingTimer.current);
    socketFlag.current = false;
    setSocket(undefined);
    setIsActive(false);
    socket?.close();
  }, [socket]);

  useEffect(() => {
    if (isActive && !socket && !socketFlag.current) {
      const ws = new WebSocket(
        process.env.NEXT_PUBLIC_AWS_APIGATEWAY_WEBSOCKET as string
      );
      ws.onopen = () => {
        console.log("Connected to WebSocket");
        setSocket(ws);
      };
      ws.onclose = () => {
        removeSocket();
      };
      ws.onerror = (error) => {
        removeSocket();
      };
      ws.onmessage = (event) => {
        const { success, action, message, user_id, error } = JSON.parse(
          event.data
        );
        if (!success || error) {
          console.log(error || "Unknown error");
          return;
        }
        switch (action) {
          case "pong":
            // console.log("pong");
            clearTimeout(pingTimer.current);
            pingTimer.current = setTimeout(() => {
              if (ws && ws.readyState === WebSocket.OPEN) {
                // console.log("ping");
                ws.send(
                  JSON.stringify({
                    action: "ping",
                  })
                );
              }
            }, minutesToMilliseconds(1));
            break;
          case "user cached":
            console.log("user successfully cached");
            break;
          case "new notification":
            console.log("new notification");
            break;
          default:
            console.log(JSON.parse(event.data));
        }
      };
    } else {
      if (socket && !isActive) {
        socket.close();
      }
    }
    window.addEventListener("beforeunload", removeSocket);
    return () => {
      window.removeEventListener("beforeunload", removeSocket);
      if (socket) {
        removeSocket();
      }
    };
  }, [isActive, removeSocket, socket]);

  useEffect(() => {
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      user &&
      !socketFlag.current
    ) {
      socketFlag.current = true;
      socket.send(
        JSON.stringify({
          action: "cache user",
          user_id: user._id,
        })
      );
      socket.send(
        JSON.stringify({
          action: "ping",
        })
      );
    }
  }, [socket, user]);

  const resetTimer = useCallback(() => {
    if (!user) return;
    clearTimeout(activityTimer.current);
    setIsActive(true);
    activityTimer.current = setTimeout(() => {
      setIsActive(false);
    }, minutesToMilliseconds(10));
  }, [user]);

  useEffect(() => {
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      if (activityTimer.current) {
        clearTimeout(activityTimer.current);
      }
    };
  }, [resetTimer]);

  useEffect(() => {
    if (isActive) {
      // poll for new notifications
      //
    }
  }, [isActive]);

  return (
    <>
      {children}{" "}
      {/* <button
        onClick={removeSocket}
        className="absolute top-40 left-4 z-50 p-2 bg-black"
      >
        disconnect
      </button> */}
      <Notification />
    </>
  );
};

export default NotificationHandler;
