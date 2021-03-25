import React, { useRef, useState, useContext, useEffect } from "react";
import Props from "./login-modal.model";
import {
  Box,
  Modal,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Button,
  ModalOverlay,
  IconButton,
  InputRightElement,
  useToast,
  FormErrorMessage,
  InputGroup,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { AuthContext } from "../auth-functions/auth-functions";
import { isMobile } from "react-device-detect";

const LoginModal: React.FC<Props> = (props: Props) => {
  const {
    handleLogin,
    emailError,
    passwordError,
    clearErrors,
    runningAuth,
    user,
  } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isOpen, onClose } = props;

  const toast = useToast();

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const [showPassword, setShowPassword] = useState(false);

  const initialRef = useRef();

  const togglePassVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleProceed = () => {
    handleLogin(email, password);
  };

  useEffect(() => {
    if (!runningAuth && user) {
      toast({
        title: "Creating Account Successful",
        status: "warning",
        duration: 9000,
        position: isMobile ? "bottom" : "bottom-right",
        isClosable: true,
      });
      onClose();
    }
  }, [runningAuth, user]);

  useEffect(() => {
    clearErrors();
  }, []);

  return (
    <Box>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired isInvalid={!!emailError}>
              <FormLabel>Email</FormLabel>
              <Input
                variant="filled"
                type="email"
                ref={initialRef}
                placeholder="email"
                value={email}
                onChange={handleEmailChange}
              />
              <FormErrorMessage>{emailError}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!passwordError} mt={4} isReadOnly>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  variant="filled"
                  placeholder="********"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                />

                <InputRightElement width="4.5rem">
                  <IconButton
                    // variant="ghost"
                    colorScheme="black"
                    aria-label={
                      showPassword ? "show password" : "hide password"
                    }
                    icon={<ViewIcon />}
                    onClick={togglePassVisibility}
                    h="1.75rem"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{passwordError}</FormErrorMessage>
            </FormControl>

            <Button size="xs" mt={5} variant="link">
              forgot password?
            </Button>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleProceed}>
              Proceed
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LoginModal;
