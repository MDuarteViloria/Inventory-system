import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx";
import PrincipalLayout from "./Components/Subcomponents/PrincipalLayout.jsx";
import { useState } from "react";
import contexts from "./Sources/Contexts.js";
import es_base from "./Sources/es_base.js";
import Products from "./Components/Products.jsx";
import ProductNew from "./Components/ProductNew.jsx";
import Locations from "./Components/Locations.jsx";
import ProductEdit from "./Components/ProductEdit.jsx";
import Origins from "./Components/Origins.jsx";
import Categories from "./Components/Categories.jsx";
import Providers from "./Components/Providers.jsx";
import Inventory from "./Components/Inventory.jsx";
import InventoryEntry from "./Components/InventoryEntry.jsx";
import InventoryEntryNew from "./Components/InventoryEntryNew.jsx";
import SeeEntry from "./Components/SeeEntry.jsx";
import Login from "./Components/Login.jsx";
import api from "./Sources/Api.js";
import InventoryOutput from "./Components/InventoryOutput.jsx";
import InventoryOutputNew from "./Components/InventoryOutputNew.jsx";
import Settings from "./Components/Settings.jsx";
import SeeOutput from "./Components/SeeOutput.jsx";
import Users from "./Components/Users.jsx";
import Images from "./Components/Images.jsx";
import zh_base from "./Sources/zh_base.js";
import InventoryHistorial from "./Components/InventoryHistorial.jsx";

function App() {
  const [lang, setLang] = useState(
    localStorage.getItem("lang") ? localStorage.getItem("lang") : "es"
  );
  const [user, setUser] = useState({});

  const validatePermissions = async () => {
    try {
      const response = await api.get("/auth/validate");
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      window.location.href = "/login";
    }
  };

  return (
    <>
      <div className="light">
        <meta itemProp="language" content={lang} />
        <contexts.langContext.Provider
          value={{
            user,
            validatePermissions,
            lang: { es: es_base, zh: zh_base }[lang],
            setLang,
          }}
        >
          <BrowserRouter>
            <PrincipalLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<ProductNew />} />
                <Route path="/products/edit/:id" element={<ProductEdit />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/origins" element={<Origins />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/providers" element={<Providers />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/historial/:productId" element={<InventoryHistorial />} />
                <Route path="/inventory/entries" element={<InventoryEntry />} />
                <Route
                  path="/inventory/outputs"
                  element={<InventoryOutput />}
                />
                <Route path="/inventory/outputs/:id" element={<SeeOutput />} />
                <Route path="/inventory/entries/:id" element={<SeeEntry />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/users" element={<Users />} />
                <Route path="/images" element={<Images />} />
                <Route
                  path="/inventory/entries/new"
                  element={<InventoryEntryNew />}
                />
                <Route
                  path="/inventory/outputs/new"
                  element={<InventoryOutputNew />}
                />
              </Routes>
            </PrincipalLayout>
          </BrowserRouter>
        </contexts.langContext.Provider>
      </div>
    </>
  );
}

export default App;
