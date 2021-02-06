import React from "react";
import HandleAuth from "../src/handle-auth/handle-login";
import { NextSeo } from "next-seo";

const CreateAccount: React.FC = () => {
  return (
    <>
      <NextSeo
        title="Create Account | Edrini"
        description="Create an account and get started"
        canonical="https://www.edrini.xyz/"
        openGraph={{
          url: "https://www.edrini.xyz/create-account",
          title: "Create Account | Edrini",
          description: "Create an account and get started",
          images: [
            {
              url: "http://edrini.xyz/meta-images/login",
              width: 1200,
              height: 628,
              alt: "Create account images",
            },
          ],
          site_name: "Edrini",
        }}
      />

      <HandleAuth authType="createAccount" />
    </>
  );
};

export default CreateAccount;
