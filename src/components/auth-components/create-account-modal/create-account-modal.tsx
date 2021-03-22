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
  InputRightElement,
  IconButton,
  InputGroup,
} from "@chakra-ui/react";
import { Props, UserInfoTypes } from "./create-account-modal.model";
import countriesList from "./countries-list";
import { v4 as uuid } from "uuid";
import { DayPicker } from "react-day-picker";
import { ViewIcon } from "@chakra-ui/icons";

const CreateAccountModal: React.FC<Props> = (props: Props) => {
  const { isOpen, onClose, finalRef } = props;
  const [userInfo, setUserInfo] = useState<UserInfoTypes>({
    fullName: "",
    birthDate: new Date(2002, 11),
    country: "",
    gender: "male",
  });
  const [showPassword, setShowPassword] = useState(false);

  const initialRef = useRef();

  const changeFullName = (e: any) => {
    setUserInfo((prevState) => ({
      ...prevState,
      fullName: e.target.value,
    }));
  };

  const togglePassVisibility = () => {
    setShowPassword(!showPassword);
  };

  const changeBirthDate = (date: Date) => {
    console.log(date);
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

  const calenderFooter = userInfo.birthDate
    ? `You selected ${userInfo.birthDate.toLocaleDateString()}.`
    : "Pick your birth date";

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
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                ref={initialRef}
                onChange={changeFullName}
                placeholder="Name"
              />
            </FormControl>

            <FormControl mt={12} mb={16}>
              <FormLabel id="birth-date">Date of Birth</FormLabel>
              <DayPicker
                mode="single"
                onSelect={changeBirthDate}
                footer={calenderFooter}
                defaultMonth={new Date(2002, 11)}
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
                value={userInfo.gender}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
            <FormControl mt={10}>
              <FormLabel>Email</FormLabel>
              <Input variant="filled" type="email" placeholder="email" />
            </FormControl>

            <FormControl mt={7}>
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
            <Button colorScheme="blue" mr={3}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateAccountModal;
