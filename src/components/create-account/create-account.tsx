import React, { useContext, useState } from "react";
import { AuthContext } from "../../handle-auth/auth-functions";
import styles from "./create-account.module.css";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Stack,
  Box,
  Text,
  Grid,
  GridItem,
  useColorMode,
} from "@chakra-ui/react";

const UserLogin: React.FC = () => {
  const { loginLoading, handleSignUp, emailError, passwordError } = useContext(
    AuthContext
  );

  const { colorMode } = useColorMode();

  const [passVisibility, setPassVisibility] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSignUp(email, password, {
      fullName,
    });
  };

  const togglePassVisibility = (): void => {
    setPassVisibility(!passVisibility);
  };

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" className={styles.container}>
        <GridItem
          display={["none", "none", "none", "initial", "initial"]}
          colSpan={[5, 5, 5, 5]}
          className={styles.illusContainer}
        >
          <div>
            <div className={styles.illusContent}>
              <Text fontSize="2xl">SurveyWave</Text>
              <Text fontSize="lg">
                Do Surveys on Your Idea/Event/Anything and Receive Peoples
                Feedback
              </Text>
            </div>

            <img
              src="/brain-taking-break.svg"
              alt="brain taking a break vector"
              className={styles.ilusImg}
            />
          </div>
        </GridItem>

        <GridItem
          colSpan={[12, 12, 12, 7, 7]}
          className={styles.authActionContainer}
        >
          <Box display={["initial", "initial", "initial", "none", "none"]}>
            <Box
              display="table"
              m="0 auto"
              borderRadius="2px"
              padding="0 5px"
              bg={
                colorMode === "dark"
                  ? "rgb(36 36 36)"
                  : "rgba(255, 240, 158, 0.721)"
              }
            >
              <Text fontSize="2xl">SurveyWave</Text>
            </Box>
          </Box>
          <Box
            className={styles.boxContainer}
            width={[
              "100%", // base
              "90%", // 480px upwards
              "80%", // 768px upwards
              "75%", // 992px upwards
            ]}
          >
            <Text
              fontSize="xl"
              className={styles.pageTitle}
              borderBottom="6px double"
              display="table"
              m="auto"
              mb="20px"
              borderColor={colorMode === "dark" ? "#e8e8e8" : "#1c212e"}
            >
              Create Account
            </Text>
            <form onSubmit={handleSubmit}>
              <Stack spacing={8}>
                <FormControl isRequired>
                  <FormLabel htmlFor="name">Full Name</FormLabel>
                  <Input
                    onChange={handleNameChange}
                    placeholder="your name"
                    type="name"
                    id="name"
                    value={fullName}
                    autoFocus
                  />
                </FormControl>
                <FormControl isInvalid={!!emailError} isRequired>
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <Input
                    type="email"
                    id="email"
                    placeholder="email"
                    aria-describedby="email-helper-text"
                    onChange={handleEmailChange}
                    value={email}
                  />
                  <FormErrorMessage>{emailError}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!passwordError} isRequired>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup size="md" id="password">
                    <Input
                      onChange={handlePassChange}
                      pr="4.5rem"
                      type={passVisibility ? "text" : "password"}
                      placeholder="password"
                      value={password}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={togglePassVisibility}
                        bg={
                          colorMode === "dark"
                            ? "#323233"
                            : "rgb(237, 242, 247)"
                        }
                        _hover={{
                          background:
                            colorMode === "dark"
                              ? "#1c1c1c"
                              : "rgb(240, 243, 247)",
                        }}
                      >
                        {passVisibility ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{passwordError}</FormErrorMessage>
                </FormControl>
                <Box
                  className={styles.submitBtnContainer}
                  width={[
                    "75%", // base
                    "60%", // 480px upwards
                    "50%", // 768px upwards
                    "45%", // 992px upwards
                    "45%",
                  ]}
                >
                  <Button
                    isLoading={loginLoading.accountCreating}
                    loadingText="Creating Account"
                    colorScheme="grey"
                    variant="outline"
                    type="submit"
                    height="43px"
                    border="2px"
                    className={styles.submitBtn}
                  >
                    Create Account
                  </Button>
                </Box>
              </Stack>
            </form>
            <a href="/login">
              <Text className={styles.authToggler}>Have account? Login</Text>
            </a>
          </Box>
        </GridItem>
      </Grid>
      <a href="/feedback" className={styles.feedbackLink}>
        <Text fontSize="sm">Having trouble? send feedback</Text>
      </a>
    </>
  );
};

export default UserLogin;
