import Og from "@/types/og";

export default interface UrlCache {
  [url: string]: {
    og: Og;
    inStack?: boolean;
  };
}
