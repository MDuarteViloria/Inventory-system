import { useContext } from "react";
import { Link } from "react-router-dom";
import Contexts from "../../Sources/Contexts";

export default function Nav() {
  const routes = [
    {
      name: "home",
      path: "/",
      icon: <box-icon type="solid" color="white" name="home"></box-icon>,
    },
    {
      name: "products",
      path: "/products",
      icon: <box-icon type="solid" color="white" name="box"></box-icon>,
    },
    {
      name: "inventory",
      path: "/inventory",
      icon: <box-icon type="solid" color="white" name="package"></box-icon>,
    },
		{
			name: "locations",
			path: "/locations",
			icon: <box-icon color="white" name='cube-alt'></box-icon>,
		},
    {
      name: "supplier",
      path: "/supplier",
      icon: <box-icon type='solid' color="white" name='contact'></box-icon>,
    },
		{
			name: "settings",
			path: "/settings",
			css: "mt-auto mb-0",
			icon: <box-icon type="solid" color="white" name="cog"></box-icon>,
		},
  ];

	const translations = useContext(Contexts.langContext)

  return (
    <nav className="bg-primary min-w-max shadow-[0_0_20px_-1px_#767b91] text-white flex flex-col gap-4 p-8 text-end text-xl">
      {routes.map((route, index) => (
        <Link
          className={
            "w-full h-10 rounded-lg flex bg-secondary/50 hover:bg-secondary justify-start px-8 items-center gap-3 transition-all " +
            route.css
          }
          key={index}
          to={route.path}
        >
          {route.icon}
          {translations.navPaths[route.name]}
        </Link>
      ))}
    </nav>
  );
}
