import React, { useRef, useState, useContext, useEffect } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormControl,
  Input,
  FormLabel,
  useToast,
  ModalFooter,
  Button,
  ModalBody,
  ModalCloseButton,
  Select,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  InputGroup,
} from "@chakra-ui/react";
import { Props, UserInfoTypes } from "./create-account-modal.model";
import countriesList from "./countries-list";
import { v4 as uuid } from "uuid";
import { DayPicker } from "react-day-picker";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { AuthContext } from "../auth-functions/auth-functions";
import { isMobile } from "react-device-detect";

const CreateAccountModal: React.FC<Props> = (props: Props) => {
  const {
    handleSignUp,
    runningAuth,
    emailError,
    passwordError,
    loginLoading,
    user,
    clearErrors,
  } = useContext(AuthContext);

  const toast = useToast();

  const { isOpen, onClose, finalRef } = props;
  const [userInfo, setUserInfo] = useState<UserInfoTypes>({
    fullName: "",
    birthDate: new Date(2002, 11),
    country: "",
    gender: "male",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const initialRef = useRef();

  useEffect(() => {
    if (!runningAuth && user) {
      onClose();
    }
  }, [runningAuth, user]);

  useEffect(() => {
    clearErrors();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

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
    console.log(typeof date);
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

  const handleSignUpSteps = () => {
    const { fullName, birthDate, gender, country } = userInfo;
    if (fullName && birthDate && gender && country) {
      handleSignUp(email, password, {
        fullName,
        birthDate,
        gender,
        country,
      });
    } else {
      toast({
        title: "Fill out all the input fields",
        description:
          "You didn't filled out all the necessary fields, fill them out to move forward.",
        status: "warning",
        duration: 9000,
        position: isMobile ? "bottom" : "bottom-right",
        isClosable: true,
      });
    }
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
            <FormControl isRequired>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                ref={initialRef}
                onChange={changeFullName}
                placeholder="Name"
              />
            </FormControl>

            <FormControl mt={12} mb={16} isRequired>
              <FormLabel id="birth-date">Date of Birth</FormLabel>
              <DayPicker
                mode="single"
                onSelect={changeBirthDate}
                footer={calenderFooter}
                defaultMonth={new Date(2002, 11)}
              />
            </FormControl>
            <FormControl mt={7} isRequired>
              <FormLabel htmlFor="country">Country</FormLabel>
              <Select
                onChange={changeCountry}
                id="country"
                placeholder="Select country"
                value={userInfo.country}
              >
                {countriesList.map((country) => (
                  <option value={country.code} key={uuid()}>
                    {country.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mt={7} isRequired>
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
            <FormControl mt={10} isRequired isInvalid={!!emailError}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                variant="filled"
                placeholder="email"
                onChange={handleEmailChange}
              />
              <FormErrorMessage>{emailError}</FormErrorMessage>
            </FormControl>

            <FormControl mt={7} isRequired isInvalid={!!passwordError}>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  variant="filled"
                  placeholder="********"
                  type={showPassword ? "text" : "password"}
                  onChange={handlePasswordChange}
                  value={password}
                />

                <InputRightElement width="4.5rem">
                  <IconButton
                    // variant="ghost"
                    colorScheme="black"
                    aria-label={
                      showPassword ? "show password" : "hide password"
                    }
                    icon={!showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={togglePassVisibility}
                    h="1.75rem"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{emailError}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              disabled={loginLoading.accountCreating}
              onClick={handleSignUpSteps}
              isLoading={loginLoading.accountCreating}
            >
              Create
            </Button>
            <Button onClick={onClose} disabled={loginLoading.accountCreating}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateAccountModal;
