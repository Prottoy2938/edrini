import userInfoDBType from "./user-data.db";

export interface AuthProviderProps {
  children: any;
}

export interface UserDataType {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: number;
  isAnonymous: boolean;
  tenantId: string;
  providerData: {
    uid: string;
    displayName: string;
    photoURL: string;
    email: string;
    phoneNumber: string;
    providerId: string;
  }[];
  apiKey: string;
  appName: string;
  authDomain: string;
  stsTokenManager: {
    apiKay: string;
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  };
  redirectEventId: unknown;
  lastLoginAt: string;
  createdAt: string;
  multiFactor: {
    enrolledFactors: unknown[];
  };
}

export interface UseProvideAuthReturned {
  user: UserDataType;
  handleSignUp: (
    email: string,
    password: string,
    {
      fullName,
      birthDate,
      country,
      gender,
    }: {
      fullName: string;
      birthDate: Date;
      country: string;
      gender: string;
    }
  ) => void;
  handleLogin: (email: string, password: string) => void;
  handleLogOut: () => void;
  emailError: string;
  passwordError: string;
  runningAuth: boolean;
  clearErrors: () => void;
  emailVerified: boolean;
  setEmailVerified: (state: boolean) => void;
  userInfoDB: userInfoDBType;
  userInfoReqFailed: boolean;
  getUserData: () => void;
  showLogOutWarning: boolean;
  setShowLogOutWarning: (state: boolean) => void;
  setUserInfoDB: React.Dispatch<React.SetStateAction<any>>;
  setLoginLoadingDispatch: React.Dispatch<{
    type: loginLoadingActions;
  }>;
  loginLoading: loginLoadingState;
}

export interface loginLoadingState {
  accountCreating: boolean;
  validatingLogin: boolean;
}

export type loginLoadingActions =
  | "creatingAccount"
  | "creatingAccountCP"
  | "loginCheck"
  | "loginCheckCP";
