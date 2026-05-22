import TopBar from "../../components/Shared/TopBar";
import Background from "../../assets/backgrounds/GeometricBG.svg?react";
import forgotPassword from "../../lib/api/General/forgotPassword";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false)


  async function handleSubmit(e : React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
        await forgotPassword(email)
        setEmailSent(true)
    } catch (error) {
        console.log("ForgotPassword - Error sending password rest link", error)
    }
  }

  async function handleResend(email: string){
        try {
            await forgotPassword(email)
        } catch (error) {
            console.log("ForgotPassword - Error sending password reset link", error)
        }
    }

  return (
    <>
      <div className="h-screen dark:bg-black flex flex-col">
        <Background className="  h-screen absolute  opacity-20" />
        <TopBar />
        <div className="flex justify-center items-center flex-1 -mt-34">
            { emailSent ? <div className="flex flex-col justify-center items-center ">
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
                    <h2 className="text-[31px] font-avant dark:text-white">Reset Email Sent</h2>
                    <div className="flex flex-row gap-1 text-interiqo-black-100 justify-center items-center">
                    <p className="text-sm">Check your inbox and spam, if you haven't recieved anything click 
                        <span 
                        className="text-interiqo-purple-400 cursor-pointer"
                        onClick={() => handleResend(email)}> resend email </span></p>
                    </div>
                </div> :
          <form
            onSubmit={handleSubmit}
            className="flex w-[471.3px] flex-col gap-8 mt-4"
          >
            <label className="flex flex-col gap-8 font-DMSans dark:text-white">
              Email
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 min-w-full border-b border-black dark:border-white p-2 text-sm font-DMSans"
                  type="text"
                />
              </div>
            </label>
            <button
              className="flex min-h-[48px] cursor-pointer hover:bg-interiqo-purple-500 justify-center items-center w-full bg-interiqo-purple-400 text-white py-2.5 text-sm font-medium mt-1"
              type="submit"
            >
              Send Password rest link
            </button>
          </form>}
        </div>
      </div>
    </>
  );
}
