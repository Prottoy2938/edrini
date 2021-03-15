import React, { useRef, useState } from "react";
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
  InputGroup,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const LoginModal: React.FC<Props> = (props: Props) => {
  const { isOpen, onClose } = props;

  const [showPassword, setShowPassword] = useState(false);

  const initialRef = useRef();

  const togglePassVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                variant="filled"
                type="email"
                ref={initialRef}
                placeholder="email"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  variant="filled"
                  placeholder="********"
                  type={showPassword ? "text" : "password"}
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
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue">Proceed</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LoginModal;
