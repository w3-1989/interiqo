import { useSearchParams, useNavigate} from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import createClientAcc from "../../lib/api/Client/createClientAcc"
import passwordValidation from "../../utils/passwordValidation"
import TopBar from "../../components/Shared/TopBar";
import Background from "../../assets/backgrounds/GeometricBG.svg?react"
import PasswordRequirements from "../../components/Shared/PasswordRequirements";
import { Lock} from "lucide-react"
import clsx from "clsx";



const submitBtnStyles ={
    default: "flex min-h-[48px] cursor-pointer justify-center items-center  w-full bg-interiqo-purple-500 text-white py-2.5 text-sm font-DMSans  mt-1",
    active: "flex min-h-[48px] cursor-pointer justify-center items-center  w-full bg-interiqo-purple-400 text-white py-2.5 text-sm font-DMSans mt-1"
}

export default function ClientAccountSetup(){

    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("")
    const [organisation, setOrganisation] = useState("")
    const [password, setPassword] = useState("")
    const [passwordCheck, setPasswordCheck] = useState({
        minLength: false,
        containsNum: false,
        containsUppercaseLetter: false,
        containsSpecialCharacter: false
    })

    const navigate = useNavigate()


    useEffect(() => {
        const fetchEmail= async () => {
            

            const {data, error:errorClaimedCheck} = await supabase
            .from('invite')
            .select('email, claimed')
            .eq("token", searchParams.get("token"))


               if (errorClaimedCheck){
                console.log("ClientAccountSetup - Error when checking to see if the email had been claimed",errorClaimedCheck)
                throw errorClaimedCheck
            } 

            if(!data || data.length === 0 ){
                return navigate("/")
            }
    
            if(data![0].claimed === true){
                return navigate("/")
            }
            
            return setEmail(data[0].email)
            
        }

        fetchEmail()
    },[])

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault()
            const {data, error:errorCrossCheckingEmail} = await supabase
            .from('invite')
            .select('email')
            .eq("token", searchParams.get("token"))

             if(errorCrossCheckingEmail){
                console.log("ClientAccountSetup - Error corss checking the users email",errorCrossCheckingEmail)
                throw errorCrossCheckingEmail
            }

             if(data![0].email !== email){
                return navigate("/")
            }

            const token = searchParams.get("token")!
            await createClientAcc(email, organisation, password, token)
            return navigate("/discovery-chat")        
        }




  return (
    <>
    <div className="h-screen flex flex-col dark:bg-interiqo-black-500">
    <Background className="absolute  h-screen opacity-20"/>
     <TopBar/>
    <section className="h-screen flex flex-col justify-center items-center">
            <div className="h-full flex flex-col justify-center items-center -mt-16">
               
                <form                     
                onSubmit={handleSubmit} 
                className="flex w-[471.3px] flex-col gap-8">
                    <label className="flex flex-col gap-8 font-DMSans dark:text-white"> Email
                        <div className="relative">
                        <input 
                            value={email}
                            placeholder={email} 
                            className=" flex-1 min-w-full  border-b border-black dark:border-white p-2 text-sm font-DMSans" 
                            disabled
                            type="text" />
                            <Lock size={16} className="absolute right-2 top-1/2 -translate-y-1/2"/>
                        </div>
                        
                    </label>
                    <label className="flex flex-col gap-8 font-DMSans dark:text-white">Organisation
                        <input 
                        value={organisation} 
                        onChange={e => setOrganisation(e.target.value)}
                        required
                        className="flex-1 min-w-0 border-b border-black dark:border-white p-2 text-sm font-DMSans" 
                        type="text" />
                    </label>
                     <label className="flex flex-col gap-8 font-DMSans dark:text-white">Password
                        <input 
                        value={password}
                        required
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setPasswordCheck(passwordValidation(e.target.value))
                        }}
                        className="flex-1 min-w-0 border-b border-black dark:border-white p-2 text-sm font-DMSans" 
                        type="password" />
                        <PasswordRequirements passwordCheck={passwordCheck}/>
                      </label>      
                    <button 
                    className={clsx( Object.values(passwordCheck).every(value => value === true) 
                        && submitBtnStyles.active ? submitBtnStyles.active : submitBtnStyles.default)}
                    type="submit"
                    disabled={ !Object.values(passwordCheck).every(value => value === true)}
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </section>
    </div>    
    </>
  );
}
