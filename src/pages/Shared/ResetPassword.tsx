import TopBar from "../../components/Shared/TopBar";
import Background from "../../assets/backgrounds/GeometricBG.svg?react";
import resetPassword from "../../lib/api/General/resetPassword";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PasswordRequirements from "../../components/Shared/PasswordRequirements";
import passwordValidation from "../../utils/passwordValidation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [confirmTouch, setConfirmTouch] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState({
    minLength: false,
    containsNum: false,
    containsUppercaseLetter: false,
    containsSpecialCharacter: false,
  });
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        await resetPassword(password);
        setPasswordUpdated(true);
      } catch (error) {
        console.log("ResetPassword - error resetting password", error);
      }
    }
  }

  useEffect(() => {
    if (passwordUpdated) {
      timerRef.current = setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [passwordUpdated]);

  return (
    <>
      <div className="h-screen dark:bg-black flex flex-col">
        <Background className="  h-screen absolute  opacity-20" />
        <TopBar />
        <div className="flex justify-center items-center flex-1 -mt-34">
          {passwordUpdated ? (
            <div className="mb-24 flex flex-col justify-center items-center align-middle">
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
              <h2 className="text-[31px] font-avant dark:text-white">
                Password Reset
              </h2>
              <div className="flex flex-row gap-1 text-interiqo-black-100 justify-center items-center">
                <p className="text-sm">
                  Page will re-direct you automatically if it doesn’t
                </p>
                <button
                  className="border-b border-interiqo-black-100 text-sm cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  click here
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-[471.3px] flex-col gap-8 mt-12"
            >
              <label className="flex flex-col gap-8 font-DMSans dark:text-white">
                Password
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordCheck(passwordValidation(e.target.value));
                    }}
                    required
                    className="flex-1 min-w-full border-b border-black dark:border-white p-2 text-sm font-DMSans"
                    type="password"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-8 font-DMSans dark:text-white">
                Confirm Password
                <div className="relative">
                  <input
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmTouch(true);
                    }}
                    required
                    className="flex-1 min-w-full border-b border-black dark:border-white p-2 text-sm font-DMSans"
                    type="password"
                  />
                </div>
              </label>
              <div>
                <PasswordRequirements passwordCheck={passwordCheck} />
              </div>
              {password !== confirmPassword && confirmTouch ? (
                <p className="text-red-400 text-[12px]">
                  The passwords don't match
                </p>
              ) : null}
              <button
                disabled={
                  !Object.values(passwordCheck).every((value) => value === true)
                }
                className="flex min-h-[48px] cursor-pointer hover:bg-interiqo-purple-500 justify-center items-center w-full bg-interiqo-purple-400 text-white py-2.5 text-sm font-medium mt-1"
                type="submit"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
