interface Props {
  message: string | null;
}

export default function FormMessage({ message }: Props) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-4 text-sm text-red-600">
      {message}
    </p>
  );
}
