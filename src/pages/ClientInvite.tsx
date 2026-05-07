import {  useState } from "react"
import sendInvite from "../lib/api/invite"



export default function ClientInvite (){

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await sendInvite(firstName, lastName, email)
    }

    return (
        <>
        <section className="h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="flex flex-col w-120 h-120 rounded-2xl gap-6 bg-white drop-shadow-md  p-5">
                 <div className="flex flex-col text-center mt-6">
                    <h1 className="text-2xl font-avant">Send a Client Invite</h1>
                    <p className="font-DMSans text-gray-400 ">Send an invite link to your client to start a project</p>
                </div>
                <form className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input 
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)} 
                        placeholder="First name" 
                        className="flex-1 min-w-0 border border-gray-200 rounded-lg p-2 text-sm" 
                        type="text" />
                        <input 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)}
                        placeholder="Last name" 
                        className="flex-1 min-w-0 border border-gray-200 rounded-lg p-2 text-sm" 
                        type="text" />
                    </div>
                    <input 
                    value={email}
                    onChange={e => setEmail(e.target.value)}  
                    placeholder="Email address" 
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm" 
                    type="email" />
                    <button 
                    onClick={handleSubmit} 
                    className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium mt-1"
                    type="button"
                    >
                        Send invite
                    </button>
                </form>
            </div>
        </section>
        </>
    )
}