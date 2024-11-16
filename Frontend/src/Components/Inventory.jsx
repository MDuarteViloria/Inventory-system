import { Button, Container, Heading, Input, StatusBadge } from "@medusajs/ui";
import { useCallback, useContext, useEffect, useState } from "react";
import Contexts from "../Sources/Contexts";
import AdaptableTable from "./Subcomponents/AdaptableTable";
import Api from "../Sources/Api";
import { useNavigate } from "react-router-dom";
import { ProductDropdown } from "./Subcomponents/ProductsTable";
import { DocumentText, Plus } from "@medusajs/icons";

export default function Inventory() {
  const lang = useContext(Contexts.langContext);
  const navigate = useNavigate();

  const [stocks, setStocks] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    const stocksResponse = await Api.get("/inventory");
    setStocks(stocksResponse.data);
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

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.navPaths.inventory}</Heading>
      </Container>
      <div className="flex gap-4 mt-5 text-center">
        {headButtons.map((btn, index) => (
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
        ))}
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
      {stocks && !stocks?.error ? (
        <AdaptableTable
          data={stocks
            .filter(
              (itm) =>
                itm.Name?.toLowerCase().includes(search?.toLowerCase()) ||
                itm.BarCode?.toLowerCase().includes(search?.toLowerCase()) ||
                itm.Code?.toLowerCase().includes(search?.toLowerCase())
            )
            .map((stk) => {
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
