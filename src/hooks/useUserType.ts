import { useContext } from "react";
import { UserTypeContext } from "../context/UserTypeContext";

export default function useUserType() {
  const userType = useContext(UserTypeContext);
  if (!userType) {
    throw new Error("useUserType must be used within a UserTypeProvider");
  }
  return userType;
}