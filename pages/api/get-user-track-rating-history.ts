import { NextApiRequest, NextApiResponse } from "next";
import verifyIdToken from "../../src/components/auth-components/auth-functions/verify-token-id";

import * as admin from "firebase-admin";

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { host, token } = req.headers;
  const { trackID } = req.body;
  if (
    host === "edrini.xyz" ||
    host === "localhost:3000" ||
    host.includes("prottoy2938") ||
    host.includes("edrini-")
  ) {
    const { uid: userUID } = await verifyIdToken(token.toString()); //checking if the user is authenticated

    //getting user info from the database
    const doc = await db
      .collection("UsersData")
      .doc(userUID)
      .collection("trackRatingGiven")
      .doc(trackID)
      .get();

    //document will only exist if the user  has given this track rating before
    if (doc.exists) {
      res.status(200).send({
        givenBefore: true,
        previousRating: doc.data().rating,
      });
    } else {
      res.status(200).send({
        givenBefore: false,
        previousRating: 4, //4 is the default rating value
      });
    }
  } else {
    res.status(401).send("You are unauthorized");
  }
};
