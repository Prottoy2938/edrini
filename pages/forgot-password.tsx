import React, { useEffect, useContext, useState } from "react";
import Head from "next/head";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Alert,
  AlertIcon,
  Stack,
  AlertTitle,
  AlertDescription,
  Spinner,
} from "@chakra-ui/react";
import { AuthContext } from "../src/components/auth-components/auth-functions/auth-functions";
import { useRouter } from "next/router";
import * as firebase from "firebase/app";
import "firebase/auth";

const ResetPassword: React.FC = () => {
  const { user, runningAuth } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    //if the user is logged-in, no need to show him the password-reset option. Reverting user to the dashboard
    if (user && !runningAuth) {
      router.push("/");
    }
  }, [user, runningAuth]);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    success: false,
    error: false,
    message: "",
    running: false,
    errCode: "",
  });

  const passwordResetSubmit = (e: any): void => {
    e.preventDefault();
    setStatus({ ...status, error: false, running: true }); //resetting the error
    firebase.default
      .auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        setStatus({ ...status, running: false, error: false, success: true }); //resetting the error
      })
      .catch(function (error: any) {
        console.error(error);
        // An error happened.
        setStatus({
          success: false,
          error: true,
          message: error.message,
          running: false,
          errCode: error.code,
        });
      });
  };

  const handleEmailChange = (e: any): void => {
    setEmail(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      {runningAuth ? (
        <Spinner m="0 auto" mt="200px" />
      ) : (
        <Box>
          <Box w={["90%", "80%", "75%", "50%"]} m="10% auto">
            <Heading>Reset Password</Heading>
            <Text mt={8}>
              Forgot your password? Please enter your email address. You will
              receive a link via email to create a new password.
            </Text>
            <form onSubmit={passwordResetSubmit} style={{ marginTop: "50px" }}>
              <Stack isInline={true}>
                <Input
                  variant="flushed"
                  placeholder="Your Email"
                  onChange={handleEmailChange}
                  type="email"
                  required
                />
                <Button disabled={status.running} type="submit">
                  Send email
                </Button>
              </Stack>
            </form>
            <Box mt={8}>
              <Stack isInline spacing={6}>
                <Text as="u">
                  <a href="/">Have Password?</a>
                </Text>

                <a
                  href="mailto:edriniproject@gmail.com
"
                >
                  <Text _hover={{ textDecor: "underline" }}>Contact</Text>
                </a>
              </Stack>
            </Box>

            {status.error && (
              <Alert
                status="error"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
                mt={20}
                borderRadius={4}
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Something Went Wrong!
                </AlertTitle>
                <AlertDescription maxWidth="sm" mt={3} lineHeight={7}>
                  {status.errCode === "auth/user-not-found"
                    ? "Invalid email or the user doesn't exists. Try again, or create an account"
                    : status.message}
                </AlertDescription>
              </Alert>
            )}
            {status.success && (
              <Alert
                status="info"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
                mt={20}
                borderRadius={4}
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Sent Email
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  Password reset email sent. Check your email, if its not there,
                  make sure to check your email's spam section.
                </AlertDescription>
              </Alert>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ResetPassword;
