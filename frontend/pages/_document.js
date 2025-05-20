import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>HireWatch</title>
        <link rel='icon' href='/image/eye.png'/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
