import { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";
import verifyIdToken from "../../src/components/auth-components/auth-functions/verify-token-id";

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
// console.log(firebasePrivateKey);
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

function getAge(birthTime: string) {
  const birthDate = new Date(birthTime);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { host, token } = req.headers;
    // When the page loads, do a call in the users collection to see if hes already given it rating
    const {
      trackID,
      birthDate,
      country,
      spotifyTrackData,
      gender,
      givenBefore,
    } = req.body;

    const age = getAge(birthDate);
    let { rating, previousRating } = req.body;
    rating = Number(rating);
    previousRating = Number(previousRating);
    const { uid: userUID } = await verifyIdToken(token.toString()); //checking if the user is authenticated

    if (
      host === "edrini.xyz" ||
      host === "localhost:3000" ||
      host.includes("prottoy2938") ||
      host.includes("edrini-")
    ) {
      if (rating <= 10 && rating >= 0) {
        if (!givenBefore) {
          //if this is a new rating, not a modifiedRating
          await db
            .collection("trackData")
            .doc(trackID)
            .update({
              [`ratings.votes.${`${rating}star`}.age.${age}`]: admin.firestore.FieldValue.increment(
                1
              ),
              [`ratings.votes.${`${rating}star`}.country.${country}`]: admin.firestore.FieldValue.increment(
                1
              ),
              [`ratings.votes.${`${rating}star`}.gender.${gender}`]: admin.firestore.FieldValue.increment(
                1
              ),
              [`ratings.votes.${`${rating}star`}.totalVotes`]: admin.firestore.FieldValue.increment(
                1
              ),
              [`ratings.votes.${`${rating}star`}.totalRatings`]: admin.firestore.FieldValue.increment(
                rating
              ),
              [`ratings.totalRatings`]: admin.firestore.FieldValue.increment(
                rating
              ),
              [`ratings.totalVotes`]: admin.firestore.FieldValue.increment(1),
            });
          await db
            .collection("UsersData")
            .doc(userUID)
            .collection("trackRatingGiven")
            .doc(trackID)
            .set({
              rating,
              when: admin.firestore.Timestamp.now(),
              spotifyTrackData,
              trackID,
            });
        } else {
          const ratingValChanged = rating - previousRating;

          if (ratingValChanged !== 0) {
            await db
              .collection("trackData")
              .doc(trackID)
              .update({
                totalRatings: admin.firestore.FieldValue.increment(
                  ratingValChanged
                ),
              });
            await db
              .collection("UsersData")
              .doc(userUID)
              .collection("trackRatings")
              .doc(trackID)
              .update({
                rating,
                when: admin.firestore.Timestamp.now(),
              });
          }
        }
        res.status(200).send("successful");
      } else {
        console.log("i'm running here");
        res.status(401).send("Cannot get");
      }
    } else {
      res.status(401).send("Cannot get");
    }
  }
};
