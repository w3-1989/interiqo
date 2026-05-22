import LoginForm from "../../components/Shared/LoginForm"
import TopBar from "../../components/Shared/TopBar";
import Background from "../../assets/backgrounds/GeometricBG.svg?react";

export default function LoginPage(){

    
    return(
        <>
        <div className="h-screen dark:bg-black">
        <Background className="  h-screen absolute  opacity-20" />
        <TopBar />
        <div className="flex justify-center align-middle">
         <LoginForm/>
        </div>
        </div>
        </>
    )
}