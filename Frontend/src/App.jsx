import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx";
import PrincipalLayout from "./Components/Subcomponents/PrincipalLayout.jsx";
import { useEffect, useState } from "react";
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

function App() {
  const [lang, setLang] = useState("es");
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const validatePermissions = async () => {
      try {
        const response = await api.get("/auth/permissions");
        if (response.status === 200) {
          setPermissions(response.data);
        }
      } catch (error) {
        window.location.href = "/login";
      }

      validatePermissions();
    };
  }, []);

  return (
    <>
      <div className="light">
        <contexts.langContext.Provider
          value={{ permissions, lang: { es: es_base }[lang], setLang }}
        >
          <BrowserRouter>
            <PrincipalLayout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<ProductNew />} />
                <Route path="/products/edit/:id" element={<ProductEdit />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/origins" element={<Origins />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/providers" element={<Providers />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/entries" element={<InventoryEntry />} />
                <Route path="/inventory/entries/:id" element={<SeeEntry />} />
                <Route
                  path="/inventory/entries/new"
                  element={<InventoryEntryNew />}
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
