export interface Props {
  isOpen: boolean;
  onClose: () => void;
  finalRef: any;
}

export interface UserInfoTypes {
  fullName: string;
  birthDate: Date;
  country: string;
  gender: string;
}
