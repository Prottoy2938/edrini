import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "../config/chakra-ui/theme";
import { AppProps } from "next/app";
import Head from "next/head";
import "../global-styles.css";
import "react-multi-carousel/lib/styles.css";
import { AuthProvider } from "../src/handle-auth/auth-functions";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ChakraProvider theme={customTheme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}
