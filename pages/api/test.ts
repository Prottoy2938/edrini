import { NextApiRequest, NextApiResponse } from "next";
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
  if (req.method === "POST") {
    // Process a POST request
    const { host } = req.headers;

    if (
      host === "edrini.xyz" ||
      host === "localhost:3000" ||
      host.includes("prottoy2938") ||
      host.includes("edrini-")
    ) {
      res.send("Hello There");
    } else {
      res.status(401).send("Cannot get");
    }
  }
};
