import { createContext } from 'react'

interface UserTypeContextType {
    userType: "client" | "freelancer"| "",
    loading: boolean
}

export const UserTypeContext = createContext<UserTypeContextType | null>(null)
