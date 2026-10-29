const inputClass =
  "mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  hint?: string;
  onChange: (value: string) => void;
}

export default function FormField({ label, hint, onChange, ...input }: Props) {
  return (
    <label className="block text-sm">
      {label} {hint && <span className="text-zinc-400">({hint})</span>}
      <input {...input} className={inputClass} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
