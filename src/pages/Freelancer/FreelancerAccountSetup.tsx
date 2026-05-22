import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useState } from "react";
import createFreelancerAcc from "../../lib/api/Freelancer/createFreelancerAcc";
import passwordValidation from "../../utils/passwordValidation";
import PasswordRequirements from "../../components/Shared/PasswordRequirements";
import clsx from "clsx";



const submitBtnStyles = {
  default:
    "w-full bg-gray-400 text-white rounded-lg py-2.5 text-sm font-medium mt-1",
  active:
    "w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium mt-1 ",
};

export default function FreelancerAccountSetup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [doesEmailExist, setDoesEmailExist] = useState(false);
  const [currentSpeciality, setCurrentSpeciality] = useState("");
  const [specialities, setSpecialities] = useState<string[]>([]);
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
        specialities,
        password,
      );
      return navigate("/freelancer-dashboard");
    }
  };

  function renderTags() {
    return specialities.map((i, index) => {
      return <span key={index}> {i}</span>;
    });
  }

  return (
    <>
      <section className="h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="flex flex-col w-120 h-140 rounded-2xl gap-6 bg-white drop-shadow-md  p-5">
          <div className="flex flex-col text-center mt-6">
            <h1 className="text-2xl font-avant">Create your account</h1>
            <p className="font-DMSans text-gray-400 ">
              Please enter your details below
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="flex-1 min-w-0 border border-gray-200 rounded-lg p-2 text-sm"
                type="text"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="flex-1 min-w-0 border border-gray-200 rounded-lg p-2 text-sm"
                type="text"
              />
            </div>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john123@gmail.com"
              className="flex-1 min-w-0 border border-gray-200 rounded-lg p-2 text-sm"
              type="text"
            />

            {doesEmailExist ? <p>Email already exists</p> : null}

            <input
              id="specialities"
              value={currentSpeciality}
              onChange={(e) => setCurrentSpeciality(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setCurrentSpeciality("");
                  setSpecialities([...specialities, currentSpeciality]);
                }
              }}
              placeholder="Enter your specialities"
              className="flex-1 min-w-0 border border-gray-200 rounded-lg p-2 text-sm"
              type="text"
            />

            {renderTags()}

            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordCheck(passwordValidation(e.target.value));
              }}
              placeholder="Create password"
              className="w-full border border-gray-200 rounded-lg p-2 text-sm"
              type="password"
            />
            <PasswordRequirements passwordCheck={passwordCheck} />

            <button
              className={clsx(
                Object.values(passwordCheck).every((value) => value === true) &&
                  submitBtnStyles.active
                  ? submitBtnStyles.active
                  : submitBtnStyles.default,
              )}
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
    </>
  );
}
