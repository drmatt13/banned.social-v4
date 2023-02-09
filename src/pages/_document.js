import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Font Awesome icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
          integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Devicon icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/devicon/2.14.0/devicon.min.css"
          integrity="sha512-Fx1qTIVtFTb41Tqu+TxfaaPCcpmkRIbOIKh+4OIwVYAECoW89rz4BnRy95Vu8MYSRgghC3pS9mJ435hzarnZcw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* open graph */}
        <meta property="og:site_name" content="Banned.Social" />
        <meta
          property="og:title"
          content="The most banned social media platform on earth."
        />
        {/* <meta property="og:description" content="" /> */}
        <meta property="og:image" content="/images/og-image.jpeg" />
        {/* URL color */}
        <meta name="theme-color" content="#3c374a" />
      </Head>
      <body className="bg-light-primary dark:bg-dark-primary text-black dark:text-white">
        <Main />
        <div id="modal" />
        <NextScript />
      </body>
    </Html>
  );
}
