import React from "react";

const Notification = () => {
  return (
    <>
      <div className="fixed top-o left-0 w-full h-full z-50 pointer-events-none">
        <div className="absolute bottom-0 left-0 transition-all translate-y-full ease-out">
          <div className="mb-4 mx-5">
            <div className="py-5 px-16 bg-white dark:bg-black border border-black/20 dark:border-white/25 shadow rounded-md pointer-events-auto">
              Notification
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
