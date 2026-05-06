



export default function ClientInvite (){
    return (
        <>
        <section className="h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="flex flex-col w-120 h-120 rounded-2xl gap-6 bg-white drop-shadow-md  p-5">
                <div className=" flex drop-shadow-md h-25 justify-center align-center">
                </div>
                 <div className="flex flex-col text-center">
                    <h1 className="text-2xl font-avant">Send a Client Invite</h1>
                    <p className="font-DMSans text-gray-400 ">Send an invite link to your client to start a project</p>
                </div>
                <form className="flex flex-col" action="email">
                    <label htmlFor="email">Client email:</label>
                    <input className="" id="email" type="email" />
                    <div className="flex flex-row gap-6 justify-end">
                        <button>Back</button>
                        <button>Send Invite</button>
                    </div>
                </form>
            </div>
        </section>
        </>
    )
}