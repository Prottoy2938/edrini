export default interface UserDbDataType {
  fullName: string;
  gender: "male" | "female" | "other";
  birthDate: Date;
  country: string;
}
