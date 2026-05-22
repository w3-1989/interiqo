import clsx from "clsx";
import { Check, X } from "lucide-react";

const passwordValidationStyle = {
  default: "text-interiqo-black-200 text-sm",
  passed: "text-green-400 text-sm",
};

interface PasswordCheckProps {
  passwordCheck: {
    minLength: boolean;
    containsNum: boolean;
    containsUppercaseLetter: boolean;
    containsSpecialCharacter: boolean;
  };
}

export default function PasswordRequirements({
  passwordCheck,
}: PasswordCheckProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        {passwordCheck.minLength ? (
          <Check size={15} color="#5805FF" />
        ) : (
          <X size={15} color="#4C4C4C" />
        )}

        <p
          className={clsx(
            passwordValidationStyle.default,
            passwordCheck.minLength && passwordValidationStyle.passed,
          )}
        >
          Minimum 8 characters
        </p>
      </div>

      <div className="flex flex-row items-center gap-2">
        {passwordCheck.containsNum ? (
          <Check size={15} color="#5805FF" />
        ) : (
          <X size={15} color="#4C4C4C" />
        )}

        <p
          className={clsx(
            passwordValidationStyle.default,
            passwordCheck.containsNum && passwordValidationStyle.passed,
          )}
        >
          Must contain one number
        </p>
      </div>

      <div className="flex flex-row items-center gap-2">
        {passwordCheck.containsUppercaseLetter ? (
          <Check size={15} color="#5805FF" />
        ) : (
          <X size={15} color="#4C4C4C" />
        )}

        <p
          className={clsx(
            passwordValidationStyle.default,
            passwordCheck.containsUppercaseLetter &&
              passwordValidationStyle.passed,
          )}
        >
          Must contain one uppercase letter
        </p>
      </div>

      <div className="flex flex-row items-center gap-2">
        {passwordCheck.containsSpecialCharacter ? (
          <Check size={15} color="#5805FF" />
        ) : (
          <X size={15} color="#4C4C4C" />
        )}

        <p
          className={clsx(
            passwordValidationStyle.default,
            passwordCheck.containsSpecialCharacter &&
              passwordValidationStyle.passed,
          )}
        >
          Must contain one symbol
        </p>
      </div>
    </div>
  );
}
