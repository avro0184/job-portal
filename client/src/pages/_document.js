// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="bn" className='font-bangla overflow-scroll no-scrollbar'>
       <Head>
        <link rel="icon" type="image/png" href="/amp.png" sizes="96x96" />
      </Head>

      <body className="noselect">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}