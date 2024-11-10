import { useState, useEffect, useContext, useCallback } from "react";
import api from "../Sources/Api";
import Contexts from "../Sources/Contexts";
import { Container, Heading, Button, Input } from "@medusajs/ui";
import { Plus, DocumentText } from "@medusajs/icons";
import { useNavigate } from "react-router-dom";
import ProductsTable from "./Subcomponents/ProductsTable";

export default function Products() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // LANG DATA
  const lang = useContext(Contexts.langContext);

  const fetchData = useCallback(async () => {
    const productResponse = await api.get("/products");
    setData(productResponse.data);
  });

  // FETCH DATA
  useEffect(() => {
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
        <div className="justify-between mt-5 w-full">
          <Input
            placeholder={lang.products.search}
            className="w-1/4"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ProductsTable
          fetchData={fetchData}
          data={data.filter((item) =>
            item.Name.toLowerCase()?.trim().includes(search.toLowerCase()?.trim()) || 
            item.BarCode?.toLowerCase()?.trim()?.includes(search.toLowerCase()?.trim()) ||
            item.Code?.toLowerCase()?.trim()?.includes(search.toLowerCase().trim())
          )}
        />
      </div>
    </>
  );
}
