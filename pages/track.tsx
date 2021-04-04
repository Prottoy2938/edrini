import React from "react";
import { NextSeo } from "next-seo";
import { Box, Heading } from "@chakra-ui/react";
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

      const trackData = doc.data();
      const relatedTracksData = [];

      const relatedTracksSnapShots = await db
        .collection("trackData")
        .where("spotifyData.id", "!=", trackId)
        .where("spotifyData.album.id", "==", trackData.spotifyData.album.id)
        .orderBy("spotifyData.id", "desc")
        // <= somehow using this doesn't returns anything. maybe firebase doesn't support nested data ordering
        // .orderBy("pageViews.totalViews", "desc")
        .limit(4)
        .get();

      relatedTracksSnapShots.forEach(function (doc) {
        relatedTracksData.push(JSON.stringify(doc.data()));
      });

      //if theres less than 4 tracks returned from the first query(currently it's from the album)
      if (relatedTracksData.length < 4) {
        console.log("I'm running here");
        const moreRTSnapShots = await db
          .collection("trackData")
          .where("spotifyData.id", "!=", trackId)
          .where("spotifyData.artists", "array-contains-any", [
            ...trackData.spotifyData.artists,
          ])
          .orderBy("spotifyData.id", "desc")
          // <= somehow using this doesn't returns anything. maybe firebase doesn't support nested data ordering
          // .orderBy("pageViews.totalViews",'desc')
          .limit(4)
          .get();
        console.log("before");
        moreRTSnapShots.forEach(function (doc) {
          console.log("query successful data test");
          relatedTracksData.push(JSON.stringify(doc.data()));
        });
      }

      //if we get nothing out of the database, then calling the spotify api to get related artist data
      if (relatedTracksData.length < 4) {
        try {
          const token = await getToken();
          const spotifyApi = new SpotifyWebApi({
            clientId,
            clientSecret,
            redirectUri: "http://www.example.com/callback",
          });
          spotifyApi.setAccessToken(token);

          //getting artist's top tracks on USA
          const res = await spotifyApi.getArtistTopTracks(
            trackData.spotifyData.artists[0].id,
            "US"
          );

          const modifiedTracks = res.body.tracks.map((track) => {
            //changing date format of the tracks release date
            track.album.release_date = admin.firestore.Timestamp.fromDate(
              new Date(track.album.release_date)
            );
            return track;
          });

          for (let i = 0; i < 4; i++) {
            relatedTracksData.push(JSON.stringify(modifiedTracks[i]));
          }

          //adding these tracks on the db
          modifiedTracks.map((track) => {
            db.collection("trackData")
              .doc(track.id)
              .set({ spotifyData: track });
          });
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

      //* *  successful data return
      return {
        props: {
          trackData: JSON.stringify(trackData),
          relatedTracksData: relatedTracksData,
          error: false,
          errorMsg: "",
          errorCode: 0,
        },
      };
    }
    // If the document doesn't exists, then getting it from the spotify database
    else {
      try {
        const token = await getToken();
        const spotifyApi = new SpotifyWebApi({
          clientId,
          clientSecret,
          redirectUri: "http://www.example.com/callback",
        });
        spotifyApi.setAccessToken(token);

        const res = await spotifyApi.getTrack(trackId);

        //adding the track in the database
        db.collection("trackData")
          .doc(trackId)
          .set({
            spotifyData: res.body,
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
          // <= somehow using this doesn't returns anything. maybe firebase doesn't support nested data ordering
          // .orderBy("pageViews.totalViews", "desc")
          .limit(4)
          .get();

        relatedTracksSnapShots.forEach(function (doc) {
          relatedTracksData.push(JSON.stringify(doc.data()));
        });

        //if theres less than 4 tracks returned from the first query(currently it's from the album)
        if (relatedTracksData.length < 4) {
          const moreRTSnapShots = await db
            .collection("trackData")
            .where("spotifyData.id", "!=", trackId)
            .where(
              "spotifyData.artists",
              "array-contains-any",
              trackData.spotifyData.artists
            )
            // <= somehow using this doesn't returns anything. maybe firebase doesn't support nested data ordering
            // .orderBy("pageViews.totalViews", "desc")
            .limit(4 - relatedTracksData.length)
            .get();
          moreRTSnapShots.forEach(function (doc) {
            relatedTracksData.push(JSON.stringify(doc.data()));
          });
        }

        //if we get nothing out of the database, then calling the spotify api to get related artist data
        if (relatedTracksData.length < 4) {
          try {
            const token = await getToken();
            const spotifyApi = new SpotifyWebApi({
              clientId,
              clientSecret,
              redirectUri: "http://www.example.com/callback",
            });
            spotifyApi.setAccessToken(token);

            //getting artist's top tracks on 'GB' / England
            const res = await spotifyApi.getArtistTopTracks(
              trackData.spotifyData.artists[0].id,
              "GB"
            );

            const modifiedTracks = res.body.tracks.map((track) => {
              //changing date format of the tracks release date
              track.album.release_date = admin.firestore.Timestamp.fromDate(
                new Date(track.album.release_date)
              );
              return track;
            });

            for (let i = 0; i < 4; i++) {
              relatedTracksData.push(JSON.stringify(modifiedTracks[i]));
            }

            //adding these tracks on the db
            modifiedTracks.map((track) => {
              db.collection("trackData")
                .doc(track.id)
                .set({ spotifyData: track });
            });
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

        //* *  successful data return
        return {
          props: {
            trackData: JSON.stringify(trackData),
            relatedTracksData: relatedTracksData,
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
  trackData: string;
  relatedTracksData: string[];
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
  } else if (!props.trackData) {
    return (
      <Heading m="0 auto" mt={10} display="table" size="2xl">
        Something went wrong!
      </Heading>
    );
  } else {
    const trackData: TrackDataProps = JSON.parse(props.trackData);
    const relatedTracksData: TrackDataProps[] = props.relatedTracksData.map(
      (track) => {
        return JSON.parse(track);
      }
    );
    return (
      <>
        <NextSeo
          title="Some title"
          description="A Web Platform Where You Can Rate Music"
        />
        <Box>
          <TrackPageAssemble
            trackData={trackData}
            relatedTracksData={relatedTracksData}
          />
        </Box>
      </>
    );
  }
};

export default Home;
