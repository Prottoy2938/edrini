import React from "react";
import { NextSeo } from "next-seo";
import { Box, Heading } from "@chakra-ui/react";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import * as admin from "firebase-admin";
import getWeekNumber from "../src/helper-functions/get-week-numbers";
import SpotifyWebApi from "spotify-web-api-node";
import getToken from "../src/helper-functions/get-token-spotify";
import AlbumDataProps from "../src/data-model/album-data.db";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const { i: albumId } = query;

  //spotify info
  const clientId = "37568751af9a4a4f912216aacb75a695";
  const clientSecret = "10900f2434c34c7a9622514eb846778a";

  if (typeof albumId === "string") {
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

    const doc = await db.collection("albumData").doc(albumId.toString()).get();

    const dateInfo = getWeekNumber(new Date());
    const currentYear = dateInfo[0];
    const currentWeekNum = `${dateInfo[1]}thWeek`;

    //if the album exists in the database
    if (doc.exists) {
      db.collection("albumData")
        .doc(albumId.toString())
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

      const albumData = doc.data();

      return {
        props: {
          albumData: JSON.stringify(albumData),
          error: false,
          errorMsg: "",
          errorCode: 0,
        },
      };
    } else {
      try {
        const token = await getToken();
        const spotifyApi = new SpotifyWebApi({
          clientId,
          clientSecret,
          redirectUri: "http://www.example.com/callback",
        });
        spotifyApi.setAccessToken(token);

        const res = await spotifyApi.getTrack(albumId);

        //adding the track in the database
        db.collection("albumData").doc(albumId).set({
          spotifyData: res.body,
        });

        const albumData: any = doc.data();

        //* *  successful data return
        return {
          props: {
            albumData: JSON.stringify(albumData),
            error: false,
            errorMsg: "",
            errorCode: 0,
          },
        };
      } catch (e) {
        console.log(e);
        return {
          props: {
            error: {
              error: true,
              errorMsg: "No tracks found",
              errorCode: 404,
            },
          },
        };
      }
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
  error: boolean;
  errorCode: number;
  errorMsg: string;
  albumData: string;
}

const Home: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props: PropTypes
) => {
  const { error, errorMsg } = props;

  if (error) {
    return (
      <Heading m="0 auto" mt={10} display="table" size="2xl">
        {errorMsg}
      </Heading>
    );
  } else if (!props.albumData) {
    return (
      <Heading m="0 auto" mt={10} display="table" size="2xl">
        Something went wrong!
      </Heading>
    );
  } else {
    const albumData: AlbumDataProps = JSON.parse(props.albumData);
    console.log(albumData);
    return (
      <>
        <NextSeo
          title="Some title"
          description="A Web Platform Where You Can Rate Music"
        />
        <Box>
          <Heading m="0 auto" mt={10} display="table" size="2xl">
            This is working
          </Heading>
        </Box>
      </>
    );
  }
};

export default Home;
