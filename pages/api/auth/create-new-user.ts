import { NextApiRequest, NextApiResponse } from "next";
import verifyIdToken from "../../../src/components/auth-components/auth-functions/verify-token-id";
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
  if (
    host === "edrini.xyz" ||
    host === "localhost:3000" ||
    host.includes("prottoy2938") ||
    host.includes("edrini-")
  ) {
    const { fullName, birthDateLocaleString, country, gender } = req.body;
    const userInfo = await verifyIdToken(token.toString()); //checking if the user is authenticated
    const { email, uid } = userInfo;
    //creating new document in the 'Users' field with the users name
    console.log(typeof birthDateLocaleString);
    console.log(birthDateLocaleString);
    await db
      .collection("UsersData")
      .doc(uid)
      .set({
        accountCreated: admin.firestore.Timestamp.now(),
        fullName: fullName,
        email: email,
        userUid: uid,
        country,
        gender,
        birthDate: admin.firestore.Timestamp.fromDate(
          new Date(birthDateLocaleString)
        ),
      });
    console.log("I'm  running here");

    res.status(201).json("Successful");
  } else {
    res.status(401).send("You are unauthorized");
  }
};
