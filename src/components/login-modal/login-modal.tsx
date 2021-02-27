import React, { useRef } from "react";
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
} from "@chakra-ui/react";

const LoginModal: React.FC<Props> = (props: Props) => {
  const { isOpen, onClose } = props;
  const initialRef = useRef();

  return (
    <Box>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>First name</FormLabel>
              <Input ref={initialRef} placeholder="First name" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Last name</FormLabel>
              <Input placeholder="Last name" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LoginModal;
