import "../app/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";


const App = ({ Component, pageProps }: AppProps) => {

  return (
    <>
      <Head>
      </Head>
      <Component
        {...pageProps}
      />
    </>
  );
};

export default App;