import React, { useRef, useState } from "react";
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
import { Props, UserInfoTypes } from "./create-account-modal.model";
import countriesList from "./countries-list";
import { v4 as uuid } from "uuid";
import DatePicker from "react-datepicker";

const CreateAccountModal: React.FC<Props> = (props: Props) => {
  const { isOpen, onClose, finalRef } = props;
  const [userInfo, setUserInfo] = useState<UserInfoTypes>({
    firstName: "",
    lastName: "",
    birthDate: new Date(),
    country: "",
    gender: "",
  });

  const initialRef = useRef();

  const changeFirstName = (e: any) => {
    setUserInfo((prevState) => ({
      ...prevState,
      firstName: e.target.value,
    }));
  };

  const changeLastName = (e: any) => {
    setUserInfo((prevState) => ({
      ...prevState,
      lastName: e.target.value,
    }));
  };

  const changeBirthDate = (date: Date) => {
    setUserInfo((prevState) => ({
      ...prevState,
      birthDate: date,
    }));
  };

  const changeGender = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserInfo((prevState) => ({
      ...prevState,
      gender: e.target.value,
    }));
  };

  const changeCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserInfo((prevState) => ({
      ...prevState,
      country: e.target.value,
    }));
  };

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
              <FormLabel htmlFor="first-name">First name</FormLabel>
              <Input
                id="first-name"
                ref={initialRef}
                onChange={changeFirstName}
                placeholder="First name"
              />
            </FormControl>

            <FormControl mt={7}>
              <FormLabel htmlFor="last-name">Last name</FormLabel>
              <Input
                id="last-name"
                placeholder="Last name"
                onChange={changeLastName}
              />
            </FormControl>
            <FormControl mt={7}>
              <FormLabel id="birth-date">Date of Birth</FormLabel>
              <DatePicker
                id="birth-date"
                selectedDate={userInfo.birthDate}
                onChange={changeBirthDate}
                showPopperArrow={true}
              />
            </FormControl>
            <FormControl mt={7}>
              <FormLabel htmlFor="country">Country</FormLabel>
              <Select
                onChange={changeCountry}
                id="country"
                placeholder="Select country"
              >
                {countriesList.map((country) => (
                  <option value={country.code} key={uuid()}>
                    {country.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={7}>
              <FormLabel htmlFor="gender">Gender</FormLabel>
              <Select
                onChange={changeGender}
                id="gender"
                placeholder="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">other</option>
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
      <DatePicker
        id="birth-date"
        selectedDate={userInfo.birthDate}
        onChange={changeBirthDate}
        showPopperArrow={true}
      />
    </Box>
  );
};

export default CreateAccountModal;
