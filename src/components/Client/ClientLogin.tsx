import TopBarSimple from "../General/TopBarSimple";
import Background from "../../assets/backgrounds/GeometricBG.svg?react";
import signInFreelancer from "../../lib/api/Freelancer/signInFreelancer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await signInFreelancer(email, password);
      navigate("/client-dashboard");
    } catch (error) {
      console.log("Unable to log user in", error);
    }
  }

  return (
    <>
      <div className="h-screen flex flex-col dark:bg-interiqo-black-500">
        <Background className="absolute  h-screen opacity-20" />
        <TopBarSimple />
        <section className="h-screen flex flex-col justify-center items-center">
          <div className="h-full flex flex-col justify-center items-center -mt-16">
            <h1>Client Login</h1>
            <form
              onSubmit={handleSubmit}
              className="flex w-[471.3px] flex-col gap-8"
            >
              <label className="flex flex-col gap-8 font-DMSans dark:text-white">
                {" "}
                Email
                <div className="relative">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className=" flex-1 min-w-full  border-b border-black dark:border-white p-2 text-sm font-DMSans"
                    type="text"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-8 font-DMSans dark:text-white">
                Password
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 min-w-0 border-b border-black dark:border-white p-2 text-sm font-DMSans"
                  type="password"
                />
                <div className="flex flex-col gap-2"></div>
              </label>
              <button
                className="flex min-h-[48px] cursor-pointer hover:bg-interiqo-purple-500 justify-center items-center  w-full bg-interiqo-purple-400 text-white py-2.5 text-sm font-medium mt-1"
                type="submit"
                disabled={!password}
              >
                Login
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
