export default function InputLabel({ label, children, className }) {
  return (
    <>
      <label className={"text-gray-500font-medium " + (className ?? "")}>
        <span className="text-[.8rem] ml-1">{label}</span>
        {children}
      </label>
    </>
  );
}
