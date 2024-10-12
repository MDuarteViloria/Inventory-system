import { useState, useEffect, useContext } from "react";
import api from "../Sources/Api";
import Contexts from "../Sources/Contexts";
import { Container, Heading, Button } from "@medusajs/ui";
import { Plus, DocumentText } from "@medusajs/icons";
import { useNavigate } from "react-router-dom";
import ProductsTable from "./Subcomponents/ProductsTable";

export default function Products() {
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  
  // LANG DATA
  const lang = useContext(Contexts.langContext);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const productResponse = await api.get("/products");
      setData(productResponse.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        <Container className="bg-primary text-white">
          <Heading level="h1">{lang.navPaths.products}</Heading>
        </Container>
        <div className="flex justify-between mt-5">
          <Button onClick={() => navigate("/products/new")} variant="secondary">
            <Plus />
            {lang.products.new}
          </Button>
          <Button variant="secondary">
            <DocumentText />
            {lang.general.export}
          </Button>
        </div>
        <ProductsTable data={data} />
      </div>
    </>
  );
}
