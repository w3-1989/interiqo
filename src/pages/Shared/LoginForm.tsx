import Login from "../../components/Shared/Login"
import TopBarSimple from "../../components/General/TopBarSimple"
import Background from "../../assets/backgrounds/GeometricBG.svg?react";

export default function LoginPage(){

    
    return(
        <>
        <div className="h-screen dark:bg-black">
        <Background className="  h-screen absolute  opacity-20" />
        <TopBarSimple />
        <div className="flex justify-center align-middle">
         <Login/>
        </div>
        </div>
        </>
    )
}