import clsx from "clsx";

const passwordValidationStyle = {
    default: "text-interiqo-black-200 text-sm",
    passed: "text-green-400 text-sm"
}

interface PasswordCheckProps{
    passwordCheck: {
         minLength: boolean,
        containsNum: boolean,
        containsUppercaseLetter: boolean,
        containsSpecialCharacter: boolean
    }
}

export default function PasswordRequirements({ passwordCheck }:PasswordCheckProps) {
  return (
    <div className="flex flex-col gap-2">
      <p
        className={clsx(
          passwordValidationStyle.default,
          passwordCheck.minLength && passwordValidationStyle.passed,
        )}
      >
        Minimum 8 characters
      </p>

      <p
        className={clsx(
          passwordValidationStyle.default,
          passwordCheck.containsNum && passwordValidationStyle.passed,
        )}
      >
        Must contain one number
      </p>
      <p
        className={clsx(
          passwordValidationStyle.default,
          passwordCheck.containsUppercaseLetter &&
            passwordValidationStyle.passed,
        )}
      >
        Must contain one uppercase letter
      </p>
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
  );
}
