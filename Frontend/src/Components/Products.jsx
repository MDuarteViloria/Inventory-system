import { useState, useEffect, useContext, useCallback } from "react";
import api from "../Sources/Api";
import Contexts from "../Sources/Contexts";
import { Container, Heading, Button, Input } from "@medusajs/ui";
import { Plus, CloudArrowDown, CloudArrowUp } from "@medusajs/icons";
import { useNavigate } from "react-router-dom";
import ProductsTable from "./Subcomponents/ProductsTable";
import generateSheet from "./Utilities/generateSheet";
import { MultiSelect } from "./Subcomponents/Multiselect";

export default function Products() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    category: [], // []
    location: [], // []
    origin: [], // []
  });
  const [filtersData, setFiltersData] = useState({
    category: [], // []
    location: [], // []
    origin: [], // []
  });
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // LANG DATA
  const { lang } = useContext(Contexts.langContext);

  const fetchData = useCallback(async () => {
    const productResponse = await api.get("/products");
    setData(productResponse.data);

    const categoryResponse = await api.get("/categories");
    const locationResponse = await api.get("/locations");
    const originResponse = await api.get("/origins");

    setFiltersData({
      category: categoryResponse.data.map((x) => ({ name: x.Name, id: x.id })),
      location: locationResponse.data.map((x) => ({ name: x.Name, id: x.id })),
      origin: originResponse.data.map((x) => ({ name: x.Name, id: x.id })),
    });
  });

  const setFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

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

  const filterProducts = (product) => {
    console.log(filters.location);

    if (
      filters.category.length > 0 &&
      !product.Categories.some((x) => filters.category.includes(x.id))
    )
      return false;

    if (
      filters.location.length > 0 &&
      !filters.location.includes(product.Location.id)
    )
      return false;

    if (
      filters.origin.length > 0 &&
      !filters.origin.includes(product.OriginProduct.id)
    )
      return false;

    return (
      product.Name.toLowerCase()
        ?.trim()
        .includes(search.toLowerCase()?.trim()) ||
      product.BarCode?.toLowerCase()
        ?.trim()
        ?.includes(search.toLowerCase()?.trim()) ||
      product.Code?.toLowerCase()?.trim()?.includes(search.toLowerCase().trim())
    );
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
        <div className="flex gap-4 flex-wrap justify-between">
          <div className="justify-between mt-5 flex-grow min-w-fit [&_>div_input]:min-w-[150px]">
            <Input
              placeholder={lang.products.search}
              className="w-1/4"
              type="search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <MultiSelect
              data={filtersData.category}
              selecteds={filters.category}
              onSelected={(item) => {
                if (filters.category.includes(item.id))
                  setFilter(
                    "category",
                    filters.category.filter((x) => x !== item.id)
                  );
                else setFilter("category", [...filters.category, item.id]);
              }}
            >
              <Button variant="secondary" className="mt-4 w-full">
                {filters.category.length} -{" "}
                {lang.products.create.labels.categories}
              </Button>
            </MultiSelect>
            <MultiSelect
              data={filtersData.origin}
              selecteds={filters.origin}
              onSelected={(item) => {
                if (filters.origin.includes(item.id))
                  setFilter(
                    "origin",
                    filters.origin.filter((x) => x !== item.id)
                  );
                else setFilter("origin", [...filters.origin, item.id]);
              }}
            >
              <Button variant="secondary" className="mt-4 min-w-max">
                {filters.origin.length} - {lang.products.create.labels.origin}
              </Button>
            </MultiSelect>
            <MultiSelect
              data={filtersData.location}
              selecteds={filters.location}
              onSelected={(item) => {
                if (filters.location.includes(item.id))
                  setFilter(
                    "location",
                    filters.location.filter((x) => x !== item.id)
                  );
                else setFilter("location", [...filters.location, item.id]);
              }}
            >
              <Button variant="secondary" className="mt-4 min-w-max">
                {filters.location.length} -{" "}
                {lang.products.create.labels.location}
              </Button>
            </MultiSelect>
          </div>
        </div>
        <ProductsTable
          fetchData={fetchData}
          data={data.filter(filterProducts)}
        />
      </div>
    </>
  );
}
