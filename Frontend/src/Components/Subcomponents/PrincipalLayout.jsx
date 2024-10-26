import Nav from "./Nav";

export default function PrincipalLayout({ children }) {
  return (
    <div className="layout-window">
      <Nav />
      <div className="flex-grow p-8 max-w-[100vw] max-h-screen md:overflow-y-auto">{children}</div>
    </div>
  );
}
