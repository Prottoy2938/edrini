import React from "react";
import { NextSeo } from "next-seo";
import {
  Input,
  Box,
  Heading,
  InputGroup,
  InputRightElement,
  DarkMode,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import * as admin from "firebase-admin";
import getWeekNumber from "../src/helper-functions/get-week-numbers";
import SpotifyWebApi from "spotify-web-api-node";
import getToken from "../src/helper-functions/get-token-spotify";

const clientId = "37568751af9a4a4f912216aacb75a695";
const clientSecret = "10900f2434c34c7a9622514eb846778a";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const { id: trackId } = query;

  if (typeof trackId === "string") {
    const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // https://stackoverflow.com/a/41044630/1332513
          privateKey: firebasePrivateKey.replace(/\\n/g, "\n"),
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    }

    const db = admin.firestore();

    const doc = await db.collection("trackData").doc(trackId.toString()).get();

    const dateInfo = getWeekNumber(new Date());
    const currentYear = dateInfo[0];
    const currentWeekNum = `${dateInfo[1]}thWeek`;

    if (doc.exists) {
      db.collection("trackData")
        .doc(trackId.toString())
        .update({
          pageViews: {
            totalViews: admin.firestore.FieldValue.increment(1),
            viewTime: {
              [currentYear]: {
                [currentWeekNum]: admin.firestore.FieldValue.increment(1), //12 is the week counter of the year
              },
            },
          },
        });

      const trackData: any = doc.data();
      //* *  successful data return
      return {
        props: {
          trackData: JSON.stringify(trackData),
        },
      };
    } else {
      getToken()
        .then((token) => {
          const spotifyApi = new SpotifyWebApi({
            clientId,
            clientSecret,
            redirectUri: "http://www.example.com/callback",
          });
          spotifyApi.setAccessToken(token);
          spotifyApi
            .getTrack(trackId)
            .then((res) => {
              db.collection("trackData")
                .doc(trackId)
                .set({
                  spotifyData: res.body,
                  pageViews: {
                    totalViews: admin.firestore.FieldValue.increment(1),
                    viewTime: {
                      [currentYear]: {
                        [currentWeekNum]: admin.firestore.FieldValue.increment(
                          1
                        ), //12 is the week counter of the year
                      },
                    },
                  },
                });

              const trackData: any = doc.data();
              //* *  successful data return
              return {
                props: {
                  trackData: JSON.stringify(trackData),
                },
              };
            })
            .catch((e) => {
              return {
                props: {
                  error: true,
                  errorMsg: "No tracks found",
                  errorCode: 404,
                }, // will be passed to the page component as props
              };
            });
        })
        .catch(() => {
          return {
            props: {
              error: true,
              errorMsg:
                "Something went wrong, if this problem consists, contact us",
              errorCode: 403,
            }, // will be passed to the page component as props
          };
        });
    }
  } else {
    return {
      props: {
        error: true,
        errorMsg: "No tracks found",
        errorCode: 404,
      }, // will be passed to the page component as props
    };
  }
};

interface PropTypes {
  error: {
    error: boolean;
    errorCode: number;
    errorMsg: string;
  };
}

const Home: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props: PropTypes
) => {
  return (
    <>
      <NextSeo
        title="Edrini"
        description="A Web Platform Where You Can Rate Music"
      />
      <Box bg="black" w="100vw" height="100vh">
        <Box d="table" m="0 auto" pt="100px">
          <Box>
            <Heading textAlign="center" size="3xl">
              Edrini
            </Heading>
            <Heading textAlign="center" as="h3" mt={10} fontSize="3xl">
              A Web Platform Where You Can Rate Music
            </Heading>
          </Box>
          <Box mt={16}>
            <DarkMode>
              <InputGroup size="lg" w="800px">
                <InputRightElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputRightElement>
                <Input
                  bg="rgba(255, 255, 255, 0.07)"
                  autoFocus
                  variant="filled"
                  placeholder="search"
                  _hover={{
                    background: "rgba(255, 255, 255, 0.09)",
                  }}
                />
              </InputGroup>
            </DarkMode>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
