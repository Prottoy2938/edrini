import React from "react";
import HandleAuth from "../src/handle-auth/handle-login";
import Head from "next/head";
import { NextSeo } from "next-seo";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Login - SurveyWave</title>
        <meta
          name="description"
          content="A Web Platform That Helps You Gather People's Impression, Thoughts on Your Ideas, Plans, Anything"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={`http://surveywave.xyz/logo-1200.jpg`}
        />
        <meta
          property="og:description"
          content="A Web Platform That Helps You Gather People's Impression, Thoughts on Your Ideas, Plans, Anything"
        />
        <meta property="og:url" content="http://surveywave.xyz/login" />
      </Head>

      <NextSeo
        title="Login | Edrini"
        description="Login to your account and share opinion"
        canonical="https://www.edrini.xyz/"
        openGraph={{
          url: "https://www.edrini.xyz/login",
          title: "Login | Edrini",
          description: "Login to your account and share opinion",
          images: [
            {
              url: "http://edrini.xyz/meta-images/login",
              width: 1200,
              height: 628,
              alt: "Login Images",
            },
          ],
          site_name: "Edrini",
        }}
      />
      <HandleAuth authType="login" />
    </>
  );
};

export default Home;
