import {  useState, useEffect, useRef } from "react"
import { Send } from 'lucide-react'
import sendInvite from "../../lib/api/Freelancer/sendInvite"



export default function SendClientInvite (){


    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [emailSent, setEmailSent] = useState(false)

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

        useEffect(() => {
        if (emailSent) {
            timerRef.current = setTimeout(() => {
            setEmailSent(false)   
            setFirstName("")
            setLastName("")
            setEmail("")
            }, 5000)
        }
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current)  
    }
    }, [emailSent])


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
         await sendInvite(firstName, lastName, email)
        setEmailSent(true)

        } catch (error) {
            console.log("SendClientInvite - error sending email invite", error)
        }


    }

    return (
        <>
        <section className=" h-full flex flex-col justify-center items-center -mt-16 ">
            <div className="flex flex-col">
                { emailSent ? <div className="mb-24 flex flex-col justify-center items-center align-middle">
                    <svg width="240" height="240" viewBox="0 0 52 52">
                    <path
                        fill="none"
                        stroke="#5805FF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="100"
                        strokeDashoffset="100"
                        d="M14 27 L22 35 L38 19"
                        className="animate-draw"
                    />
                    </svg>
                    <h2 className="text-[31px] font-avant dark:text-white">Invite Sent</h2>
                    <div className="flex flex-row gap-1 text-interiqo-black-100 justify-center items-center">
                    <p className="text-sm">Page will reset automatically if it doesn’t</p>
                    <button className="border-b border-interiqo-black-100 text-sm cursor-pointer" 
                    onClick={() => {
                    setEmailSent(false)
                    setFirstName("")
                    setLastName("")
                    setEmail("")
                    }}>click here</button>
                    </div>
                </div> : <form                     
                onSubmit={handleSubmit} 
                className="flex flex-col gap-12">
                    <div className="flex gap-8">
                        <label className="flex flex-col gap-8 font-DMSans dark:text-white">First Name
                        <input 
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)} 
                        className="flex-1 min-w-0 border-b border-black dark:border-white p-2 text-sm font-DMSans" 
                        type="text" />
                        </label>
                        <label className="flex flex-col gap-8 font-DMSans dark:text-white">Last Name
                        <input 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)}
                        className="flex-1 min-w-0 border-b border-black dark:border-white p-2 text-sm font-DMSans" 
                        type="text" />
                        </label>
                    </div>
                    <label className="flex flex-col gap-8 font-DMSans dark:text-white">Email
                    <input 
                    value={email}
                    onChange={e => setEmail(e.target.value)}  
                    className="w-full border-b border-black dark:border-white p-2 text-sm font-DMSans" 
                    type="email" />
                    </label>
                    <button 
                    className="flex min-h-[48px] cursor-pointer hover:bg-interiqo-purple-500 justify-center items-center  w-full bg-interiqo-purple-400 text-white py-2.5 text-sm font-medium mt-1"
                    type="submit"
                    >
                        <Send size={20}/>
                    </button>
                </form>}
            </div>
        </section>
        </>
    )
}