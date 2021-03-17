import React, { useRef } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormControl,
  Input,
  FormLabel,
  ModalFooter,
  Button,
  ModalBody,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react";
import { Props } from "./create-account-modal.model";
import countriesList from "./countries-list";
import { v4 as uuid } from "uuid";

const CreateAccountModal: React.FC<Props> = (props: Props) => {
  const { isOpen, onClose, finalRef } = props;
  const initialRef = useRef();
  return (
    <Box>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>First name</FormLabel>
              <Input ref={initialRef} placeholder="First name" />
            </FormControl>

            <FormControl mt={7}>
              <FormLabel>Last name</FormLabel>
              <Input placeholder="Last name" />
            </FormControl>
            <FormControl mt={7}>
              <FormLabel>Date of Birth</FormLabel>
              <Input placeholder="First name" />
            </FormControl>
            <FormControl id="country" mt={7}>
              <FormLabel>Country</FormLabel>
              <Select placeholder="Select country">
                {countriesList.map((country) => (
                  <option value={country.code} key={uuid()}>
                    {country.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateAccountModal;
