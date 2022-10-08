import { useEffect, useState } from "react";

export const useScreenWidth = () => {
  const [width, setWidth] = useState<number | null>(
    typeof window !== "undefined" ? window.innerWidth : null
  );

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width ? width <= 768 : false;

  return { isMobile };
};
