import signInFreelancer from "../../lib/api/Freelancer/signInFreelancer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [toggle, setToggle] = useState(true);

  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await signInFreelancer(email, password);
      if (toggle) {
        navigate("/freelancer-dashboard");
      } else if (!toggle) {
        navigate("/client-dashboard");
      }
    } catch (error) {
      console.log("Unable to log user in", error);
      setError(true);
    }
  }

  function handleFreelancerToggleClick() {
    setToggle(true);
  }
  function handleClientToggleClick() {
    setToggle(false);
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center align-middle mt-16">
        <form
          onSubmit={handleSubmit}
          className="flex w-[471.3px] flex-col gap-8 mt-14"
        >
          <p className=" dark:text-white">Sign in as</p>
          <div
            className="flex max-w-[471.3px] min-h-[56px] p-1 items-center justify-center gap-8
                bg-white dark:bg-interiqo-black-400 border border-black/5 cursor-pointer"
          >
            <button
              className={clsx("min-h-[44px] w-1/2 cursor-pointer", {
                "bg-interiqo-purple-400 text-white": toggle,
                "bg-white dark:bg-interiqo-black-400 dark:text-white": !toggle,
              })}
              onClick={handleFreelancerToggleClick}
              type="button"
            >
              Freelancer
            </button>
            <button
              className={clsx("min-h-[44px] w-1/2 cursor-pointer", {
                "bg-white dark:bg-interiqo-black-400 dark:text-white": toggle,
                "bg-interiqo-purple-400 text-white": !toggle,
              })}
              onClick={handleClientToggleClick}
              type="button"
            >
              Client
            </button>
          </div>
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
          <label className="flex flex-col gap-8 font-DMSans dark:text-white">
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 min-w-0 border-b border-black dark:border-white p-2 text-sm font-DMSans"
              type="password"
            />
          </label>
          {error && (
            <p className="text-red-400 text-[12px]">
              Invalid email or password
            </p>
          )}

          <button
            className="flex min-h-[48px] cursor-pointer hover:bg-interiqo-purple-500 justify-center items-center w-full bg-interiqo-purple-400 text-white py-2.5 text-sm font-medium mt-1"
            type="submit"
            disabled={!password}
          >
            Login
          </button>
        </form>
        {toggle ? (
          <p className="text-sm font-DMSans mt-4 dark:text-white">
            Don't have an account?{" "}
            <a
              href="/freelancer-account-setup"
              className="text-interiqo-purple-400 cursor-pointer"
            >
              Create account
            </a>
          </p>
        ) : (
          <p className="text-sm font-DMSans mt-4 dark:text-white">
            An account must be created via an{" "}
            <span className="text-interiqo-purple-400">Invite</span>
          </p>
        )}
      </div>
    </>
  );
}
