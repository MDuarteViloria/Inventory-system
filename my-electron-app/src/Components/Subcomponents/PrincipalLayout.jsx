import Nav from "./Nav";

export default function PrincipalLayout({ children }) {
  return (
    <div className="layout-window">
      <Nav />
      <div>{children}</div>
    </div>
  );
}
