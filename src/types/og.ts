interface Og {
  description?: string;
  image?: {
    url: string;
    width: number;
    height: number;
    type: string;
  };
  siteName?: string;
  title?: string;
  url?: string;
}

export default Og;
