import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Contexts from "../../Sources/Contexts";
import api from "../../Sources/Api";

export default function Nav() {
  const [hidden, setHidden] = useState(true);

  const navigate = useNavigate();

  const routes = [
    {
      name: "back",
      icon: <box-icon color="white" name="arrow-back"></box-icon>,
    },
    {
      name: "home",
      path: "/",
      icon: <box-icon type="solid" color="white" name="home"></box-icon>,
    },
    {
      name: "products",
      path: "/products",
      permission: "PRODUCTOS",
      icon: <box-icon type="solid" color="white" name="box"></box-icon>,
    },
    {
      name: "inventory",
      path: "/inventory",
      permission: "INVENTARIO",
      icon: <box-icon type="solid" color="white" name="package"></box-icon>,
    },
    {
      name: "categories",
      path: "/categories",
      permission: "PRODUCTOS",
      icon: (
        <box-icon type="solid" color="white" name="category-alt"></box-icon>
      ),
    },
    {
      name: "origins",
      path: "/origins",
      permission: "PRODUCTOS",
      icon: <box-icon type="solid" name="map-alt" color="white"></box-icon>,
    },
    {
      name: "locations",
      path: "/locations",
      permission: "PRODUCTOS",
      icon: <box-icon color="white" name="cube-alt"></box-icon>,
    },
    {
      name: "providers",
      path: "/providers",
      permission: "PROVEEDORES",
      icon: <box-icon type="solid" color="white" name="contact"></box-icon>,
    },
    {
      name: "settings",
      path: "/settings",
      css: "mt-auto mb-0",
      icon: <box-icon type="solid" color="white" name="cog"></box-icon>,
    },
  ];

  const {
    lang: translations,
    user: { user, permissions },
    validatePermissions,
  } = useContext(Contexts.langContext);

  const logout = () => {
    api.get("/auth/logout").then(() => navigate("/login"));
  };

  useEffect(() => {
    validatePermissions();
  }, []);


  return (
    <>
      <button
        onClick={() => {
          setHidden(!hidden);
        }}
        className={
          "w-20 h-10 z-10 shadow-lg justify-center items-center sticky top-4 left-8 md:hidden transition-[background] rounded-full bg-primary flex"
        }
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
        {routes.map((route, index) =>
          permissions?.map((x) => x.name)?.includes(route.permission) ||
          permissions?.map((x) => x.name)?.includes("SUPERADMIN") ||
          !route.permission ? (
            <Link
              onClick={() => {
                setHidden(true);
                if (!route.path) window.history.back();
              }}
              className={
                "w-full h-10 rounded-lg flex bg-secondary/50 transition-all hover:bg-secondary justify-start px-8 items-center gap-3 " +
                route.css
              }
              key={index}
              to={route.path ?? ".."}
            >
              {route.icon}
              {translations.navPaths[route.name]}
            </Link>
          ) : (
            <></>
          )
        )}
        <div className="flex flex-col items-start w-full py-4 pr-12 rounded-lg bg-secondary/50 justify-start px-4 relative">
          <p>{user?.fullName}</p>
          <p className="italic text-sm">@{user?.username}</p>
          <div
            onClick={logout}
            className="absolute cursor-pointer top-4 right-3 hover:scale-110 transition-all"
          >
            <box-icon color="white" name="log-out-circle"></box-icon>
          </div>
        </div>
      </nav>
    </>
  );
}
