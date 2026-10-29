export type LoginMode = "login" | "register";

export interface LoginFormProps {
  initialEmail: string;
  onSuccess: () => void;
  onUserNotFound: (email: string) => void;
}

export interface RegisterFormProps {
  initialEmail: string;
  notice?: string | null;
  onSuccess: () => void;
}

export interface AuthSwitchProps {
  prompt: string;
  action: string;
  onClick: () => void;
}

export interface SubmitButtonProps {
  loading: boolean;
  label: string;
  loadingLabel: string;
}
