export default interface UrlCache {
  [url: string]: {
    description: string;
    image: string;
    siteName: string;
    title: string;
    url: string;
  };
}
