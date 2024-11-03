import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Contexts from "../../Sources/Contexts";

export default function Nav() {
  const [hidden, setHidden] = useState(true);

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
      name: "categories",
      path: "/categories",
      icon: <box-icon type='solid' color="white" name='category-alt'></box-icon>,
    },
    {
      name: "origins",
      path: "/origins",
      icon: <box-icon type='solid' name='map-alt' color='white'></box-icon>,
    },
    {
      name: "locations",
      path: "/locations",
      icon: <box-icon color="white" name="cube-alt"></box-icon>,
    },
    {
      name: "providers",
      path: "/providers",
      icon: <box-icon type="solid" color="white" name="contact"></box-icon>,
    },
    {
      name: "settings",
      path: "/settings",
      css: "mt-auto mb-0",
      icon: <box-icon type="solid" color="white" name="cog"></box-icon>,
    },
  ];

  const translations = useContext(Contexts.langContext);

  return (
    <>
      <button
        className={
          "w-20 h-10 z-10 shadow-lg justify-center items-center sticky top-4 left-8 md:hidden rounded-full bg-primary flex"
        }
        onClick={() => setHidden(false)}
      >
        <box-icon name="menu" size="sm" color="white"></box-icon>
      </button>
      <nav
        className={
          "bg-primary z-20 top-0 md:flex transition-[width,opacity] bottom-0 left-0 fixed md:static min-w-max shadow-[0_0_20px_-1px_#00000070] w-max text-white flex-col gap-4 p-4 lg:p-8 text-end text-sm lg:text-base " +
          (hidden ? "hide" : "flex")
        }
      >
        <button
          onClick={() => {
            setHidden(!hidden);
          }}
          className="md:hidden ml-auto mr-0 w-10 h-10 flex justify-center items-center"
        >
          <box-icon color="white" name="x"></box-icon>
        </button>
        {routes.map((route, index) => (
          <Link
            onClick={() => {
              setHidden(true);
            }}
            className={
              "w-full h-10 rounded-lg flex bg-secondary/50 hover:bg-secondary justify-start px-8 items-center gap-3 " +
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
    </>
  );
}
