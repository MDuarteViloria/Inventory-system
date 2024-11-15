import {
  Button,
  Container,
  Heading,
  Input,
  StatusBadge,
  Textarea,
  toast,
  Toaster,
} from "@medusajs/ui";
import { useCallback, useContext, useEffect, useState } from "react";
import Contexts from "../Sources/Contexts";
import AdaptableTable from "./Subcomponents/AdaptableTable";
import Api from "../Sources/Api";
import { useNavigate } from "react-router-dom";
import { ProductDropdown } from "./Subcomponents/ProductsTable";
import { DocumentText, Plus } from "@medusajs/icons";
import Selector from "./Subcomponents/Selector";
import InputLabel from "./Subcomponents/Label";
import promptWithComponent from "./Utilities/promptWithComponent";
import FormPromptComponent from "./Subcomponents/FormPromptComponent";

export default function Inventory() {
  const lang = useContext(Contexts.langContext);

  const [items, setItems] = useState(null);
  const [providers, setProvidsers] = useState([]);

  const fetchData = useCallback(async () => {
    const providersResponse = await Api.get("/providers");
    setProvidsers(providersResponse.data);
  }, []);

  const addItem = async () => {
    const newLine = await promptWithComponent((resolve) => (
      <FormPromptComponent
        resolve={resolve}
        lang={lang}
        title={lang.inventory.general.addProduct}
        type="select"
        fields={[
          {
            nameProp: "product",
            placeholder: lang.inventory.placeholder.product,
            type: "selector",
            selectorData: [
              ["NameCodes"],
              lang.inventory.placeholder.product,
              lang.general.cancel,
              lang.general.searchInput,
              lang.general.noItems,
            ],
            getData: async () => {
              return await Api.get("/products").then((x) =>
                x.data.map((x) => ({
                  ...x,
                  NameCodes:
                    `${x.Code} - ${x.Name}` + (x.BarCode ? ` - ${x.BarCode}` : ""),
                }))
              );
            },
            values: providers.map((x) => ({ item: x.id, label: x.Name })),
          },
          {
            nameProp: "provider",
            label: lang.inventory.placeholder.provider,
            type: "select",
            values: providers.map((x) => ({
              item: JSON.stringify(x),
              label: x.Name,
            })),
          },
          {
            nameProp: "quantity",
            label: lang.inventory.placeholder.quantityEntry,
            type: "number",
          },
          {
            nameProp: "images",
            label: lang.inventory.placeholder.images,
            type: "images",
          },
        ]}
      />
    ));

    if(!newLine.quantity || !newLine.provider || !newLine.product)
      toast.error(lang.products.create.validations.badParams)

    if (newLine)
      setItems(
        items
          ? [
              ...items,
              {
                quantity: parseInt(newLine.quantity),
                provider: JSON.parse(newLine.provider),
                product: newLine.product,
                images: newLine.product,
              },
            ]
          : [
              {
                quantity: parseInt(newLine.quantity),
                provider: JSON.parse(newLine.provider),
                product: newLine.product,
                images: newLine.product,
              },
            ]
      );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.inventory.entry}</Heading>
      </Container>
      <div className="flex justify-between w-full [&_>div]:min-w-[150px] [&_>div]:w-1/4">
        <InputLabel
          label={lang.products.create.labels.description}
          className="w-full text"
        >
          <Textarea placeholder={lang.inventory.placeholder.description} />
        </InputLabel>
      </div>
      <div className="flex justify-between w-full mb-5 [&_>div]:min-w-[150px] [&_>div]:w-1/4">
        <Button onClick={addItem} variant="secondary">
          <DocumentText />
          {lang.inventory.general.addProduct}
        </Button>
      </div>
      {items ? (
        <AdaptableTable
          data={items.map((itm) => {
            return {
              id: itm.product.id,
              Code: itm.product.Code,
              Name: itm.product.Name,
              Quantity: itm.quantity,
              Provider: itm.provider.Name,
            };
          })}
          columnModel={{
            order: ["id", "Code", "Name", "Quantity", "Provider"],
            dataModel: {
              id: lang.inventory.general.id,
              Code: lang.inventory.labels.code,
              Name: lang.inventory.labels.product,
              Quantity: lang.inventory.labels.quantity,
              Provider: lang.inventory.labels.provider,
            },
          }}
        />
      ) : (
        <div className="border-t border-b py-4 mx-4">
          <Heading level="h2" className="text-center text-sm">
            Selecciona el primer producto
          </Heading>
        </div>
      )}
      <Toaster/>
    </div>
  );
}
