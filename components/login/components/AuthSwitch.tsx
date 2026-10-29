import type { AuthSwitchProps } from "../types/loginTypes";

export default function AuthSwitch({ prompt, action, onClick }: AuthSwitchProps) {
  return (
    <p className="mt-4 text-center text-sm text-zinc-600">
      {prompt}{" "}
      <button
        type="button"
        onClick={onClick}
        className="font-medium text-zinc-900 underline hover:text-zinc-700"
      >
        {action}
      </button>
    </p>
  );
}
