import React from "react";
import { NextSeo } from "next-seo";
import { Box } from "@chakra-ui/react";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import * as admin from "firebase-admin";
import getWeekNumber from "../src/helper-functions/get-week-numbers";
import SpotifyWebApi from "spotify-web-api-node";
import getToken from "../src/helper-functions/get-token-spotify";
import TrackDataProps from "../src/data-model/track-data.db";
import TrackPageAssemble from "../src/components/track-page/track-page-assemble/track-page-assemble";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const { i: trackId } = query;

  //spotify info
  const clientId = "37568751af9a4a4f912216aacb75a695";
  const clientSecret = "10900f2434c34c7a9622514eb846778a";

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
      const relatedTracksData = [];

      const relatedTracksSnapShots = await db
        .collection("trackData")
        .where("spotifyData.id", "!=", trackId)
        .where("spotifyData.album.id", "==", trackData.spotifyData.album.id)
        .orderBy("spotifyData.id", "desc")
        .orderBy("pageViews.totalViews", "desc")
        .limit(3)
        .get();

      relatedTracksSnapShots.forEach(function (doc) {
        relatedTracksData.push(JSON.stringify(doc.data()));
      });

      //if theres less than 3 tracks returned from the first query(currently it's from the album)
      if (relatedTracksData.length < 3) {
        const moreRTSnapShots = await db
          .collection("trackData")
          .where("spotifyData.id", "!=", trackId)
          .where(
            "spotifyData.artists",
            "array-contains-any",
            trackData.spotifyData.artists
          )
          .orderBy("spotifyData.id", "desc")
          .orderBy("pageViews.totalViews", "desc")
          .limit(3 - relatedTracksData.length)
          .get();
        moreRTSnapShots.forEach(function (doc) {
          relatedTracksData.push(JSON.stringify(doc.data()));
        });
      }

      //* *  successful data return
      return {
        props: {
          trackData: JSON.stringify(trackData),
          relatedTracksData: relatedTracksData,
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
            .then(async (res) => {
              //adding the track in the database
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
              const relatedTracksData = [];

              const relatedTracksSnapShots = await db
                .collection("trackData")
                .where("spotifyData.id", "!=", trackId)
                .where(
                  "spotifyData.album.id",
                  "==",
                  trackData.spotifyData.album.id
                )
                .orderBy("spotifyData.id", "desc")
                .orderBy("pageViews.totalViews", "desc")
                .limit(3)
                .get();

              relatedTracksSnapShots.forEach(function (doc) {
                relatedTracksData.push(JSON.stringify(doc.data()));
              });

              //if theres less than 3 tracks returned from the first query(currently it's from the album)
              if (relatedTracksData.length < 3) {
                const moreRTSnapShots = await db
                  .collection("trackData")
                  .where("spotifyData.id", "!=", trackId)
                  .where(
                    "spotifyData.artists",
                    "array-contains-any",
                    trackData.spotifyData.artists
                  )
                  .orderBy("pageViews.totalViews", "desc")
                  .limit(3 - relatedTracksData.length)
                  .get();
                moreRTSnapShots.forEach(function (doc) {
                  relatedTracksData.push(JSON.stringify(doc.data()));
                });
              }

              //* *  successful data return
              return {
                props: {
                  trackData: JSON.stringify(trackData),
                  relatedTracksData: relatedTracksData,
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
  trackData: string;
  relatedTracksData: string[];
}

const Home: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props: PropTypes
) => {
  const trackData: TrackDataProps = JSON.parse(props.trackData);
  const relatedTracksData: TrackDataProps[] = props.relatedTracksData.map(
    (track) => {
      return JSON.parse(track);
    }
  );

  console.log(trackData);
  return (
    <>
      <NextSeo
        title="Some title"
        description="A Web Platform Where You Can Rate Music"
      />
      <Box>
        <TrackPageAssemble trackData={trackData} />
      </Box>
    </>
  );
};

export default Home;
