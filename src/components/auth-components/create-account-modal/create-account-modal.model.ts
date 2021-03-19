export interface Props {
  isOpen: boolean;
  onClose: () => void;
  finalRef: any;
}

export interface UserInfoTypes {
  firstName: string;
  lastName: string;
  birthDate: Date;
  country: string;
  gender: string;
}
