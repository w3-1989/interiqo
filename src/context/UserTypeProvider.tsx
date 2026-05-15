import useCheckUserType from "../hooks/useCheckUserType"
import { UserTypeContext } from "./UserTypeContext"

export function UserTypeProvider({ children }: { children: React.ReactNode }) {
  const {userType, loading} = useCheckUserType()
  
  return (
    <UserTypeContext.Provider value={{ userType, loading }}>
      {children}
    </UserTypeContext.Provider>
  )
}