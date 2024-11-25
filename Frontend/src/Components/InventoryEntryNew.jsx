import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Textarea,
  toast,
  Toaster,
} from "@medusajs/ui";
import { useCallback, useContext, useEffect, useState } from "react";
import Contexts from "../Sources/Contexts";
import AdaptableTable from "./Subcomponents/AdaptableTable";
import Api from "../Sources/Api";
import {
  DocumentText,
  EllipsisHorizontal,
  Eye,
  PencilSquare,
  Trash,
} from "@medusajs/icons";
import InputLabel from "./Subcomponents/Label";
import promptWithComponent from "./Utilities/promptWithComponent";
import FormPromptComponent from "./Subcomponents/FormPromptComponent";
import ConfirmPrompt from "./Utilities/confirmPromptComponent";
import seeImages from "./Utilities/seeImages";
import { useNavigate } from "react-router-dom"

export default function InventoryEntryNew() {
  const { lang } = useContext(Contexts.langContext);

  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");
  const [providers, setProvidsers] = useState([]);

  const fetchData = useCallback(async () => {
    const providersResponse = await Api.get("/providers");
    setProvidsers(providersResponse.data);
  }, []);

  const addItem = async (newItems) => {
    const newLine = await promptWithComponent((resolve) => (
      <FormPromptComponent
        resolve={resolve}
        lang={lang}
        recursive={true}
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
                    `${x.Code} - ${x.Name}` +
                    (x.BarCode ? ` - ${x.BarCode}` : ""),
                }))
              );
            },
          },
          {
            nameProp: "provider",
            label: lang.inventory.placeholder.provider,
            type: "select",
            values: providers.map((x) => ({
              item: JSON.stringify(x),
              label: `${x.Doc} - ${x.Name}`,
            })),
          },
          {
            nameProp: "details",
            label: lang.inventory.placeholder.details,
            type: "text",
          },
          {
            nameProp: "quantity",
            label: lang.inventory.placeholder.quantityEntry,
            type: "number",
          },
          {
            nameProp: "images",
            label: lang.inventory.placeholder.images,
            defaultValue: [],
            type: "images",
          },
        ]}
      />
    ));

    if (!newLine.quantity || !newLine.provider || !newLine.product)
      return toast.error(lang.products.create.validations.badParams);

    newLine.provider = JSON.parse(newLine.provider);

    if (newLine) {
      const oldItems = newItems ? newItems : items;

      let newTemp = [];

      if (
        oldItems.some(
          (val) =>
            val.provider.id === newLine.provider.id &&
            val.product.id === newLine.product.id
        )
      )
        newTemp = oldItems.map((itm) =>
          itm.provider.id === newLine.provider.id &&
          itm.product.id === newLine.product.id
            ? {
                ...itm,
                quantity: itm.quantity + parseInt(newLine.quantity),
                details: itm.details + " - " + newLine.details,
                images: [
                  ...new Set([
                    ...(itm.images ?? []),
                    ...(newLine.images ?? []),
                  ]),
                ],
              }
            : { ...itm }
        );
      else
        newTemp = [
          ...oldItems,
          {
            quantity: parseInt(newLine.quantity),
            provider: newLine.provider,
            product: newLine.product,
            details: newLine.details,
            images: newLine.images ?? [],
          },
        ];

      setItems(newTemp);
      setTimeout(() => addItem(newTemp), 150);
    }
  };

  const saveEntry = async (e) => {
    e.target.disabled = true;

    const response = await Api.post("/inventory/entries", {
      Description: description,
      Lines: items.map((itm) => {
        return {
          ProductId: itm.product.id,
          Details: itm.details,
          ProviderId: itm.provider.id,
          Images: itm.images.map((x) => x.id),
          Quantity: itm.quantity,
        };
      })
    });

    if(response.status === 200) {
      toast.success(lang.inventory.entryCreate.success);
      setTimeout(() => navigate("/inventory/entries"), 1000);
    } else {
      e.target.disabled = false;
      toast.error(lang.inventory.entryCreate.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.inventory.general.newEntry}</Heading>
      </Container>
      <div className="flex justify-between w-full [&_>div]:min-w-[150px] [&_>div]:w-1/4">
        <InputLabel
          label={lang.products.create.labels.description}
          className="w-full text"
        >
          <Textarea
            onChange={(e) => setDescription(e.target.value)}
            placeholder={lang.inventory.placeholder.description}
          />
        </InputLabel>
      </div>
      <div className="flex justify-between w-full mb-5 [&_>div]:min-w-[150px] [&_>div]:w-1/4">
        <Button onClick={() => addItem()} variant="secondary">
          <DocumentText />
          {lang.inventory.general.addProduct}
        </Button>
      </div>
      {items && items.length > 0 ? (
        <AdaptableTable
          data={items.map((itm, ind) => {
            return {
              id: itm.product.id,
              Code: itm.product.Code,
              Name: itm.product.Name,
              Details: itm.details,
              Quantity: itm.quantity,
              Provider: itm.provider.Name,
              dropDown: (
                <InventoryLineDropdown
                  lines={items}
                  setLines={setItems}
                  lang={lang}
                  index={ind}
                />
              ),
            };
          })}
          columnModel={{
            order: [
              "id",
              "Code",
              "Name",
              "Details",
              "Quantity",
              "Provider",
              "dropDown",
            ],
            dataModel: {
              id: lang.inventory.general.id,
              Code: lang.inventory.labels.code,
              Name: lang.inventory.labels.product,
              Details: lang.inventory.labels.details,
              Quantity: lang.inventory.labels.quantity,
              Provider: lang.inventory.labels.provider,
              dropDown: "",
            },
            css: {},
          }}
        />
      ) : (
        <div className="border-t border-b py-4 mx-4">
          <Heading level="h2" className="text-center text-sm">
            Selecciona el primer producto
          </Heading>
        </div>
      )}
      <Button
        onClick={saveEntry}
        disabled={!items || items.length === 0}
        variant="secondary"
        className="w-full md:w-1/4 mr-0 ml-auto"
      >
        {lang.general.save}
      </Button>
      <Toaster />
    </div>
  );
}

function InventoryLineDropdown({ setLines, lines, index, lang }) {
  const editLine = async () => {
    const { quantity, images, details } = await promptWithComponent(
      (resolve) => (
        <FormPromptComponent
          resolve={resolve}
          lang={lang}
          title={lang.providers.new}
          fields={[
            {
              nameProp: "details",
              topLabel: lang.inventory.labels.details,
              label: lang.inventory.placeholder.details,
              type: "text",
              defaultValue: lines[index].details,
              maxLenght: 80,
            },
            {
              nameProp: "quantity",
              topLabel: lang.inventory.labels.quantity,
              label: lang.inventory.placeholder.quantityEntry,
              type: "number",
              defaultValue: lines[index].quantity,
            },
            {
              nameProp: "images",
              label: lang.inventory.placeholder.images,
              defaultValue: lines[index].images,
              type: "images",
            },
          ]}
        />
      )
    );

    if (quantity && (quantity > 0 || quantity !== "")) {
      setLines(
        lines.map((line, i) =>
          i === index ? { ...line, quantity, images, details } : line
        )
      );
      toast.success(lang.inventory.edit.editted);
    } else if (quantity == "") {
      toast.error(lang.inventory.edit.badParams);
    }
  };

  const deleteLine = async () => {
    const confirmed = await promptWithComponent((resolve) => (
      <ConfirmPrompt resolve={resolve} lang={lang} />
    ));

    if (confirmed) {
      setLines(lines.filter((_, i) => i !== index));
      toast.success(lang.general.deletedSuccess);
    }
  };

  const seeLineImages = () =>
    seeImages(
      lines[index]?.images.map((x) => x.url),
      lang
    );

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={editLine} className="gap-x-2">
            <PencilSquare className="text-ui-fg-subtle" />
            {lang.general.edit}
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={seeLineImages} className="gap-x-2">
            <Eye className="text-ui-fg-subtle" />
            {lang.inventory.general.seeImages}
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={deleteLine} className="gap-x-2">
            <Trash className="text-ui-fg-subtle" />
            {lang.general.delete}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}
