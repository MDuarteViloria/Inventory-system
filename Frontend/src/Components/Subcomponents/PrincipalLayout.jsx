import Nav from "./Nav";

export default function PrincipalLayout({ children }) {
  return (
    <div className="layout-window">
      <Nav />
      <div className="flex-grow p-8 md:pt-8 pt-20 max-w-[100vw]">{children}</div>
    </div>
  );
}
