import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx";
import PrincipalLayout from "./Components/Subcomponents/PrincipalLayout.jsx";
import { useState } from "react";
import contexts from "./Sources/Contexts.js";
import es_base from "./Sources/es_base.js";

function App() {
  const [lang, setLang] = useState(es_base);

  return (
    <>
    <div className="light">
      <contexts.langContext.Provider value={{...lang}}>
        <BrowserRouter>
          <PrincipalLayout>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </PrincipalLayout>
        </BrowserRouter>
      </contexts.langContext.Provider>
    </div>
    </>
  );
}

export default App;
