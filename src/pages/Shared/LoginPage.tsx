import { useState } from "react"
import FreelancerLogin from "../../components/Freelancer/FreelancerLogin"
import ClientLogin from "../../components/Client/ClientLogin"

export default function LoginPage(){

    const [toggle, setToggle] = useState(true)

    function handleClick(){
        setToggle(!toggle)
    }

    
    return(
        <>
        <button onClick={handleClick}>Freelancer</button>
        <button onClick={handleClick}>Client</button>

        {toggle ? <FreelancerLogin/> :
        <ClientLogin/>}
        </>
    )
}