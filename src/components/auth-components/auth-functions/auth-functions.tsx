import React, { useState, useEffect, createContext, useReducer } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import {
  AuthProviderProps,
  UseProvideAuthReturned,
  loginLoadingActions,
  loginLoadingState,
  UserDataType,
} from "../../../data-model/auth-data.db";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import UserDbDataType from "../../../data-model/user-data.db";
import { isMobile } from "react-device-detect";

if (!firebase.default.apps.length) {
  firebase.default.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
  });
}

const acCreatingReducer = (
  state: loginLoadingState,
  action: { type: loginLoadingActions }
): loginLoadingState => {
  switch (action.type) {
    case "creatingAccount":
      return { validatingLogin: false, accountCreating: true };
    case "loginCheck":
      return { validatingLogin: true, accountCreating: false };
    case "creatingAccountCP":
      return { validatingLogin: false, accountCreating: false };
    case "loginCheckCP":
      return { validatingLogin: false, accountCreating: false };
    default:
      throw new Error();
  }
};

const useProvideAuth = (): UseProvideAuthReturned => {
  const [user, setUser] = useState<UserDataType | undefined>();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [runningAuth, setRunningAuth] = useState(true); //tracking the state of `onAuthStateChange`. We need to handle some tasks if the authentication process is still running.
  const [emailVerified, setEmailVerified] = useState(true);
  //users info on the database
  const [userInfoDB, setUserInfoDB] = useState<UserDbDataType | undefined>(
    undefined
  );
  const [userInfoReqFailed, setUserInfoReqFailed] = useState(false); //checking if getting userInfo from database failed
  const [showLogOutWarning, setShowLogOutWarning] = useState(false);
  //to show a loading bar when the users signs in
  const [loginLoading, setLoginLoadingDispatch] = useReducer(
    acCreatingReducer,
    {
      accountCreating: false,
      validatingLogin: false,
    }
  );

  const toast = useToast();

  const clearErrors = (): void => {
    setEmailError("");
    setPasswordError("");
  };

  //a function that gets user data from the database and updates `userInfoDB` state
  const getUserData = (): void => {
    firebase.default
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then((idToken: string) => {
        axios
          .get("/api/get-user-data", {
            headers: {
              token: idToken,
            },
          })
          .then((res) => {
            setUserInfoDB({
              ...res.data,
              birthDate: new Date(res.data.birthDate._seconds * 1000),
            });
            setUserInfoReqFailed(false);
          })
          .catch((e: any) => {
            setUserInfoReqFailed(true);
            console.log(e);
          });
      })

      .catch((e: any) => {
        setUserInfoReqFailed(true);
        console.log(e);
      });
  };

  const handleLogin = (email: string, password: string): void => {
    clearErrors();
    setLoginLoadingDispatch({ type: "loginCheck" });

    firebase.default
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        setLoginLoadingDispatch({ type: "creatingAccountCP" });

        //getting user data from the database
        if (!userInfoDB) {
          getUserData();
        }
        //if user email is not verified
        if (!user.emailVerified) {
          setEmailVerified(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoginLoadingDispatch({ type: "creatingAccountCP" });
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
            setEmailError(err.message);
            break;
          case "auth/user-not-found":
            setEmailError("No user found associated with this email");
            break;
          case "auth/wrong-password":
            setPasswordError(
              "The password is invalid or email, password doesn't match"
            );
            break;
          default:
            setEmailError("Something went wrong");
            setPasswordError(
              "Something went wrong, try again. Check you network connection or contact us"
            );
            break;
        }
      });
  };
  const handleSignUp = (
    email: string,
    password: string,
    { fullName, birthDate, country, gender }: UserDbDataType
  ): void => {
    setLoginLoadingDispatch({ type: "creatingAccount" });
    clearErrors(); //clearing form input errors

    firebase.default
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user
          .updateProfile({
            displayName: fullName,
          })
          .then(() => {
            setLoginLoadingDispatch({ type: "creatingAccountCP" });

            firebase.default
              .auth()
              .currentUser.getIdToken(/* forceRefresh */ true)
              .then((idToken: string) => {
                //not passing down any user information except the users token, will use that in the backend api to get users info
                axios
                  .post(
                    "/api/auth/create-new-user",
                    {
                      fullName,
                      birthDateLocaleString: birthDate.toLocaleDateString(),
                      country,
                      gender,
                    },
                    {
                      headers: {
                        token: idToken,
                      },
                    }
                  )
                  .then(() => {
                    toast({
                      title: "Account Created Successfully",
                      description:
                        "Your account was created successfully, you can now use the functionality.",
                      status: "success",
                      duration: 9000,
                      position: isMobile ? "bottom" : "bottom-right",
                      isClosable: true,
                    });
                    //if theres no userInfoDB data
                    if (!userInfoDB) {
                      getUserData();
                    }
                  })
                  .catch(() => {
                    console.log("failed created user account on the db");
                  });
              });
          });
      })
      .catch((err) => {
        setLoginLoadingDispatch({ type: "creatingAccountCP" });
        console.log(err);
        switch (err.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
          default:
            setEmailError("Something went wrong");
            setPasswordError("Something went wrong, try again");
            break;
        }
      });
  };
  const handleLogOut = (): void => {
    setShowLogOutWarning(true);
    firebase.default.auth().signOut();
    setUserInfoDB(undefined); //removing users data from the state
  };
  //runs everytime auth state changes
  const authListener = (): void => {
    firebase.default.auth().onAuthStateChanged((user: any) => {
      if (user) {
        setShowLogOutWarning(false);

        setUser(user);
        setRunningAuth(false);
        setUserInfoReqFailed(false);

        //if user email is not verified
        if (!user.emailVerified) {
          setEmailVerified(false);
        }
        //if theres no userInfoDB data
        if (!userInfoDB) {
          getUserData();
        }
      } else {
        setUser(undefined);
        setRunningAuth(false);
        setUserInfoDB(undefined);
      }
    });
  };

  useEffect(() => {
    setRunningAuth(true);
    authListener();
  }, []);

  return {
    user,
    handleSignUp,
    handleLogin,
    handleLogOut,
    emailError,
    passwordError,
    runningAuth,
    clearErrors,
    emailVerified,
    setEmailVerified,
    userInfoDB,
    userInfoReqFailed,
    getUserData,
    showLogOutWarning,
    setShowLogOutWarning,
    setUserInfoDB,
    setLoginLoadingDispatch,
    loginLoading,
  };
};

export const AuthContext = createContext<UseProvideAuthReturned | undefined>(
  undefined
);

export const AuthProvider: React.FC<AuthProviderProps> = (
  props: AuthProviderProps
) => {
  const { children } = props;
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
