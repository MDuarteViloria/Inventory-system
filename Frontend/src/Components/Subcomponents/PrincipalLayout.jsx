import Nav from "./Nav";
import {useMatch} from "react-router-dom"

export default function PrincipalLayout({ children }) {
  const shouldRenderNav = !useMatch("/login");

  return (
    <div className="layout-window">
      {shouldRenderNav && <Nav />}
      <div className={`flex-grow ${shouldRenderNav ? "p-8" : ""} max-w-[100vw] max-h-screen md:overflow-y-auto`}>{children}</div>
    </div>
  );
}
