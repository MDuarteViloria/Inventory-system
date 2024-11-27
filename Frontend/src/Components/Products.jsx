import { useState, useEffect, useContext, useCallback } from "react";
import api from "../Sources/Api";
import Contexts from "../Sources/Contexts";
import { Container, Heading, Button, Input } from "@medusajs/ui";
import { Plus, CloudArrowDown, CloudArrowUp } from "@medusajs/icons";
import { useNavigate } from "react-router-dom";
import ProductsTable from "./Subcomponents/ProductsTable";
import generateSheet from "./Utilities/generateSheet";

export default function Products() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // LANG DATA
  const { lang } = useContext(Contexts.langContext);

  const fetchData = useCallback(async () => {
    const productResponse = await api.get("/products");
    setData(productResponse.data);
  });

  const exportSheet = () => {
    const flatData = data.map((x) => ({
      ...x,
      Images: x.Images.map((y) => y.Url).join("\n"),
      Categories: x.Categories.map((y) => y.Name).join("\n"),
      OriginProduct: x.OriginProduct?.Name ?? "-",
      Location: x.Location?.Name ?? "-",
    }));
    generateSheet(flatData, new Date().getTime() + "_products");
  };

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
        <div className="flex gap-4 flex-wrap justify-between mt-5 [&_*]:leading-none">
          <Button onClick={() => navigate("/products/new")} variant="secondary">
            <Plus />
            {lang.products.new}
          </Button>
          <span className="flex gap-4">
            <Button onClick={exportSheet} variant="secondary">
              <CloudArrowDown />
              {lang.general.export}
            </Button>
            <Button variant="secondary">
              <CloudArrowUp />
              {lang.general.import}
            </Button>
          </span>
        </div>
        <div className="justify-between mt-5 w-full [&_>div_input]:min-w-[150px]">
          <Input
            placeholder={lang.products.search}
            className="w-1/4"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ProductsTable
          fetchData={fetchData}
          data={data.filter(
            (item) =>
              item.Name.toLowerCase()
                ?.trim()
                .includes(search.toLowerCase()?.trim()) ||
              item.BarCode?.toLowerCase()
                ?.trim()
                ?.includes(search.toLowerCase()?.trim()) ||
              item.Code?.toLowerCase()
                ?.trim()
                ?.includes(search.toLowerCase().trim())
          )}
        />
      </div>
    </>
  );
}
