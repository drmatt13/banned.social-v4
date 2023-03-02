import { useEffect } from "react";

const Test = () => {
  useEffect(() => {
    console.log("test");
  }, []);

  return <div>test</div>;
};

export default Test;
