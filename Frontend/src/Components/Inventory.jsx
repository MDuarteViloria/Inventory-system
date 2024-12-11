import { Button, Container, Heading, Input, StatusBadge } from "@medusajs/ui";
import { useCallback, useContext, useEffect, useState } from "react";
import Contexts from "../Sources/Contexts";
import AdaptableTable from "./Subcomponents/AdaptableTable";
import Api from "../Sources/Api";
import { useNavigate } from "react-router-dom";
import { ProductDropdown } from "./Subcomponents/ProductsTable";
import { DocumentText, Plus } from "@medusajs/icons";
import { MultiSelect } from "./Subcomponents/Multiselect";

export default function Inventory() {
  const {
    lang,
    user: { permissions },
  } = useContext(Contexts.langContext);

  const navigate = useNavigate();

  const [stocks, setStocks] = useState(null);
  const [search, setSearch] = useState("");
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

  const setFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const fetchData = useCallback(async () => {
    const stocksResponse = await Api.get("/inventory");
    setStocks(stocksResponse.data);

    const categoryResponse = await Api.get("/categories");
    const locationResponse = await Api.get("/locations");
    const originResponse = await Api.get("/origins");

    setFiltersData({
      category: categoryResponse.data.map((x) => ({ name: x.Name, id: x.id })),
      location: locationResponse.data.map((x) => ({ name: x.Name, id: x.id })),
      origin: originResponse.data.map((x) => ({ name: x.Name, id: x.id })),
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const headButtons = [
    {
      title: lang.inventory.entry,
      onClick: () => navigate("/inventory/entries"),
    },
    {
      title: lang.inventory.output,
      onClick: () => navigate("/inventory/outputs"),
    },
  ];

  const filterProducts = (product) => {
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

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.navPaths.inventory}</Heading>
      </Container>
      <div className="flex gap-4 mt-5 text-center">
        {permissions?.map((x) => x.name).includes("MOVIMIENTOS") ||
          (permissions?.map((x) => x.name).includes("SUPERADMIN") &&
            headButtons.map((btn, index) => (
              <Container
                onClick={btn.onClick}
                key={index}
                className="container-button [&_*]:leading-none md:p-8 p-4"
              >
                <Heading
                  className="text-gray-700 font-medium md:text-base text-sm"
                  level="h2"
                >
                  {btn.title}
                </Heading>
              </Container>
            )))}
      </div>
      <div className="flex justify-between mt-5 w-full [&_>div]:min-w-[150px] [&_>div]:w-1/4">
        <Input
          placeholder={lang.general.search}
          type="search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="secondary">
          <DocumentText />
          {lang.general.export}
        </Button>
      </div>
      <div className="flex gap-2 mr-auto">
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
            {filters.category.length} - {lang.products.create.labels.categories}
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
            {filters.location.length} - {lang.products.create.labels.location}
          </Button>
        </MultiSelect>
      </div>
      {stocks && !stocks?.error ? (
        <AdaptableTable
          data={stocks.filter(filterProducts).map((stk) => {
            return {
              id: stk.id,
              Name: stk.Name,
              Quantity: stk.Quantity,
              Status:
                stk.Quantity > 0 ? (
                  <StatusBadge color="green" className="text-center">
                    {lang.inventory.stock.true}
                  </StatusBadge>
                ) : (
                  <StatusBadge color="red" className="text-center">
                    {lang.inventory.stock.false}
                  </StatusBadge>
                ),
              dropDown: <ProductDropdown product={stk} />,
            };
          })}
          columnModel={{
            order: ["id", "Name", "Quantity", "Status", "dropDown"],
            dataModel: {
              id: lang.inventory.general.id,
              Name: lang.inventory.general.name,
              Quantity: lang.inventory.general.quantity,
              Status: lang.inventory.general.status,
              dropDown: "",
            },
            css: {
              Name: "w-1/4",
              Quantity: "w-1/4",
              Status: "w-full",
              id: "w-1/4",
            },
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
