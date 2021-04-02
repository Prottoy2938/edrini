import React, { useState, useRef, useContext } from "react";
import {
  Box,
  chakra,
  Button,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverFooter,
  PopoverBody,
  PopoverHeader,
  PopoverCloseButton,
  PopoverArrow,
  ButtonGroup,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Props from "./rating-section.model";
import { AuthContext } from "../../auth-components/auth-functions/auth-functions";
import axios from "axios";
import dynamic from "next/dynamic";
import * as firebase from "firebase/app";
import "firebase/auth";
import { isMobile } from "react-device-detect";

const CreateAccountModal = dynamic(
  () =>
    import("../../auth-components/create-account-modal/create-account-modal")
);
const LoginModal = dynamic(
  () => import("../../auth-components/login-modal/login-modal")
);

const RatingSection: React.FC<Props> = (props: Props) => {
  const { userRating, setUserRating, trackData } = props;

  const handleRatingChange = (val) => {
    setUserRating(Number(val));
  };

  const { user, runningAuth, userInfoDB, getUserData } = useContext(
    AuthContext
  );
  const {
    isOpen: signUpModalOpen,
    onOpen: handleSignUpModalOpen,
    onClose: closeSignUpModal,
  } = useDisclosure();

  const {
    isOpen: loginModalOpen,
    onOpen: handleLoginModalOpen,
    onClose: closeLoginModal,
  } = useDisclosure();

  const authInitialFocusRef = useRef();
  const authEndFocusRef = useRef();
  const toast = useToast();

  const {
    onOpen: handleAuthOptionOpen,
    onClose: handleAuthOptionClose,

    isOpen: authOptionOpen,
  } = useDisclosure();

  //closing the both dialog and auth popover option
  const handleSignUpModalClose = () => {
    closeSignUpModal();
    handleAuthOptionClose();
  };

  const handleLoginModalClose = () => {
    closeLoginModal();
    handleAuthOptionClose();
  };

  const colorDependClass =
    userRating <= 30 ? "r-3" : userRating <= 70 ? "r-8" : "r-10";

  const styledNumber = (posNum: number, color: string) => {
    return userRating === posNum
      ? {
          style: {
            color,
          },
          label: <chakra.strong fontSize="lg">{posNum / 10}</chakra.strong>,
        }
      : posNum / 10;
  };

  const marks = {
    0: styledNumber(0, "#559945"),
    10: styledNumber(10, "#559945"),
    20: styledNumber(20, "#559945"),
    30: styledNumber(30, "#559945"),
    40: styledNumber(40, "#ffa200"),
    50: styledNumber(50, "#ffa200"),
    60: styledNumber(60, "#ffa200"),
    70: styledNumber(70, "#ffa200"),
    80: styledNumber(80, "#ff006f"),
    90: styledNumber(90, "#ff006f"),
    100: styledNumber(100, "#ff006f"),
  };

  const handleRatingSubmit = () => {
    if (user) {
      if (!userInfoDB) {
        getUserData();
      } else {
        firebase.default
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then((idToken: string) => {
            //not passing down any user information except the users token, will use that in the backend api to get users info
            axios.post(
              "/api/add-user-rating",
              {
                trackID: trackData.spotifyData.id,
                birthDate: userInfoDB.birthDate,

                country: userInfoDB.country,
                gender: userInfoDB.gender,
                spotifyTrackData: trackData,
                // changedRating
              },
              {
                headers: {
                  token: idToken,
                },
              }
            );
          })
          .catch((e) => {
            toast({
              title: "Something went wrong",
              description:
                "Couldn't submit your rating. Try again, if this problem persists,  contact us.",
              status: "error",
              duration: 9000,
              position: isMobile ? "bottom" : "bottom-right",
              isClosable: true,
            });
          });
      }
    } else {
      handleAuthOptionOpen();
    }
  };
  return (
    <Box mt={6}>
      <Box className={colorDependClass}>
        {/* {
      // transform: scale(1.5) 
    // } */}
        <Slider
          dots
          min={0}
          marks={marks}
          step={20}
          onChange={handleRatingChange}
          defaultValue={20}
        />
      </Box>
      <Box>
        <Box textAlign="right" mt={12}>
          <Popover
            placement="bottom"
            closeOnBlur={false}
            isOpen={authOptionOpen}
            initialFocusRef={authInitialFocusRef}
            onOpen={handleRatingSubmit}
            onClose={handleAuthOptionClose}
          >
            <PopoverTrigger>
              <Button size="sm" colorScheme="cyan" ref={authEndFocusRef}>
                Submit
              </Button>
            </PopoverTrigger>
            <PopoverContent
              color="white"
              bg="blue.800"
              borderColor="blue.800"
              textAlign="left"
            >
              {!user && runningAuth ? (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                  pos="absolute"
                  top="30%"
                  left="45%"
                />
              ) : user && !runningAuth ? null : (
                <>
                  <PopoverHeader pt={4} fontWeight="bold" border="0">
                    You're Not Logged in
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    Login to your account to submit. Or create an account if you
                    haven't, it only takes a minute.
                  </PopoverBody>
                  <PopoverFooter
                    border="0"
                    d="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    pb={4}
                  >
                    <ButtonGroup size="sm">
                      <Button
                        colorScheme="green"
                        onClick={handleSignUpModalOpen}
                        ref={authInitialFocusRef}
                      >
                        Create Account
                      </Button>
                      <Button onClick={handleLoginModalOpen} colorScheme="blue">
                        Login
                      </Button>
                    </ButtonGroup>
                  </PopoverFooter>
                </>
              )}
            </PopoverContent>
          </Popover>
        </Box>
      </Box>
      {/* <Box mt={20} mb={20} height={["50%", "40%", "50%", "300px"]}>
        <Box height="100%" display="flex" flexDirection="row" mt="20%">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
            <Box
              // To make the component bigger, make sure to use same number on the `pt`, `pb` and `mt`.
              key={uuid()}
              width="3px"
              pt={`${10 * num}px`}
              pb={`${10 * num}px`}
              height="1px"
              bg="blue.500"
              mr={1}
              ml={1}
              mt={`calc(50% - ${10 * num}px)`}
            />
          ))}
        </Box>
      </Box> */}
      {signUpModalOpen && (
        <CreateAccountModal
          onClose={handleSignUpModalClose}
          isOpen={signUpModalOpen}
          finalRef={authEndFocusRef}
        />
      )}

      {loginModalOpen && (
        <LoginModal
          isOpen={loginModalOpen}
          onClose={handleLoginModalClose}
          finalRef={authEndFocusRef}
        />
      )}
    </Box>
  );
};

export default RatingSection;
