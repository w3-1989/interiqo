import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useState } from "react";
import TopBar from "../../components/Shared/TopBar";
import Background from "../../assets/backgrounds/GeometricBG.svg?react"
import createFreelancerAcc from "../../lib/api/Freelancer/createFreelancerAcc";
import passwordValidation from "../../utils/passwordValidation";
import PasswordRequirements from "../../components/Shared/PasswordRequirements";
import clsx from "clsx";


const submitBtnStyles ={
    default: "flex min-h-[48px] cursor-pointer justify-center items-center  w-full bg-interiqo-purple-500 text-white py-2.5 text-sm font-DMSans  mt-1",
    active: "flex min-h-[48px] cursor-pointer justify-center items-center  w-full bg-interiqo-purple-400 text-white py-2.5 text-sm font-DMSans mt-1"
}

export default function FreelancerAccountSetup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [doesEmailExist, setDoesEmailExist] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState({
    minLength: false,
    containsNum: false,
    containsUppercaseLetter: false,
    containsSpecialCharacter: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error: errorCrossCheckingEmail } = await supabase
      .from("freelancers")
      .select("email")
      .eq("email", email);

    if (errorCrossCheckingEmail) {
      console.log(
        "FreelancerAccountSetup - Email already in use",
        errorCrossCheckingEmail,
      );
      throw errorCrossCheckingEmail;
    }

    if (data.length > 0) {
      setDoesEmailExist(true);
    } else {
      await createFreelancerAcc(
        firstName,
        lastName,
        email,
        password,
      );
      return navigate("/freelancer-dashboard");
    }
  };

 



  return (
    <>
    <div className="h-screen flex flex-col dark:bg-interiqo-black-500">
    <Background className="absolute  h-screen opacity-20"/>
     <TopBar/>
      <section className="h-screen flex flex-col justify-center items-center">
        <div className="h-full flex flex-col justify-center items-center -mt-20">
          <form onSubmit={handleSubmit} className="flex w-[471.3px] flex-col gap-8">
            <div className="flex gap-8">
              <label className="flex flex-col gap-8 font-DMSans dark:text-white">First Name
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 min-w-full  border-b border-black dark:border-white p-2 text-sm font-DMSans"
                type="text"
              />
              </label>
              <label className="flex flex-col gap-8 font-DMSans dark:text-white">Last Name
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-1 min-w-full  border-b border-black dark:border-white p-2 text-sm font-DMSans"
                type="text"
              />
              </label>
            </div>
            <label className="flex flex-col gap-8 font-DMSans dark:text-white">Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-full  border-b border-black dark:border-white p-2 text-sm font-DMSans"
              type="text"
            />
            </label>

            {doesEmailExist ? <p className="text-red-400 text-[12px]">Email already exists</p> : null}
  
            <label className="flex flex-col gap-8 font-DMSans dark:text-white">Password
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordCheck(passwordValidation(e.target.value));
              }}
              className="flex-1 min-w-full  border-b border-black dark:border-white p-2 text-sm font-DMSans"
              type="password"
            />
            </label>
            <PasswordRequirements passwordCheck={passwordCheck} />

            <button
              className={clsx( Object.values(passwordCheck).every(value => value === true) 
                                      && submitBtnStyles.active ? submitBtnStyles.active : submitBtnStyles.default)}
              type="submit"
              disabled={
                !Object.values(passwordCheck).every((value) => value === true)
              }
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
