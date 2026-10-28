interface Props {
  loading: boolean;
  label: string;
  loadingLabel: string;
}

export default function SubmitButton({ loading, label, loadingLabel }: Props) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-6 w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
