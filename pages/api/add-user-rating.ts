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
    const { trackID, birthDate, country, spotifyTrackData, gender } = req.body;

    const age = getAge(birthDate);
    let { rating } = req.body;
    rating = Number(rating);
    const { uid: userUID } = await verifyIdToken(token.toString()); //checking if the user is authenticated

    if (
      host === "edrini.xyz" ||
      host === "localhost:3000" ||
      host.includes("prottoy2938") ||
      host.includes("edrini-")
    ) {
      if (rating <= 10 && rating >= 0) {
        // checking user's previous rating on the here
        const givenBefore = await db
          .collection("UsersData")
          .doc(userUID)
          .collection("trackRatingGiven")
          .doc(trackID)
          .get();

        if (givenBefore.exists) {
          //if the user already given it a rating before
          const { rating: previousRating } = givenBefore.data();

          const ratingChangedVal = rating - previousRating;

          if (ratingChangedVal !== 0) {
            await db
              .collection("trackData")
              .doc(trackID)
              .update({
                [`ratings.totalRatings`]: admin.firestore.FieldValue.increment(
                  ratingChangedVal
                ),
                // Removing data from previous rating position
                [`ratings.votes.${`${previousRating}star`}.age.${age}`]: admin.firestore.FieldValue.increment(
                  -1
                ),
                [`ratings.votes.${`${previousRating}star`}.country.${country}`]: admin.firestore.FieldValue.increment(
                  -1
                ),
                [`ratings.votes.${`${previousRating}star`}.gender.${gender}`]: admin.firestore.FieldValue.increment(
                  -1
                ),
                [`ratings.votes.${`${previousRating}star`}.totalVotes`]: admin.firestore.FieldValue.increment(
                  -1
                ),
                [`ratings.votes.${`${previousRating}star`}.totalRatings`]: admin.firestore.FieldValue.increment(
                  -previousRating
                ),
                //adding data to the new rating position
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
              });
            await db
              .collection("UsersData")
              .doc(userUID)
              .collection("trackRatingGiven")
              .doc(trackID)
              .update({
                rating,
                when: admin.firestore.Timestamp.now(),
              });
          }
        } else {
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
