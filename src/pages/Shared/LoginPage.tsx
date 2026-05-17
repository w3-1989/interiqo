import { useState } from "react"
import FreelancerLogin from "../../components/Freelancer/FreelancerLogin"
import ClientLogin from "../../components/Client/ClientLogin"
import TopBarSimple from "../../components/General/TopBarSimple"
import Background from "../../assets/backgrounds/GeometricBG.svg?react";
import clsx from "clsx";

export default function LoginPage(){

    const [toggle, setToggle] = useState(true)

    function handleFreelancerClick(){
        setToggle(true)
    }
    function handleClientClick(){
        setToggle(false)
    }

    
    return(
        <>
        <div className="h-screen flex flex-col dark:bg-interiqo-black-500 ">
        <Background className="absolute  h-screen opacity-20" />
        <TopBarSimple />

            <div className=" relative flex justify-center mb-20 flex-col gap-4 flex-1 items-center ">
            <p className="w-[471.3px] dark:text-white">Sign in as</p>
            <div className="flex min-w-[471.3px] min-h-[56px] p-1 items-center justify-center gap-8
                bg-white dark:bg-interiqo-black-400 border border-black/5 cursor-pointer">
                <button className={clsx("min-h-[44px] w-1/2 cursor-pointer", { "bg-interiqo-purple-400 text-white": toggle, "bg-white dark:bg-interiqo-black-400 dark:text-white": !toggle })}
                    onClick={handleFreelancerClick}>Freelancer</button>
                <button className={clsx("min-h-[44px] w-1/2 cursor-pointer", { "bg-white dark:bg-interiqo-black-400 dark:text-white": toggle, "bg-interiqo-purple-400 text-white": !toggle })}
                    onClick={handleClientClick}>Client</button>
            </div>
            {toggle ? <FreelancerLogin/> : <ClientLogin/>}
        </div>
        </div>
        </>
    )
}