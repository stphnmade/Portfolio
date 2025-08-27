export default function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs opacity-80">
      {children}
    </span>
  );
}
