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
import { useNavigate } from "react-router-dom";

export default function InventoryOutputNew() {
  const { lang } = useContext(Contexts.langContext);

  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [description, setDescription] = useState("");

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
            nameProp: "details",
            label: lang.inventory.placeholder.details,
            type: "text",
          },
          {
            nameProp: "quantity",
            label: lang.inventory.placeholder.quantityOutput,
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

    if (!newLine.quantity || !newLine.product)
      return toast.error(lang.products.create.validations.badParams);

    if (newLine.quantity <= 0)
      return toast.error(lang.inventory.outputCreate.quantity);

    if (newLine) {
      const oldItems = newItems ? newItems : items;

      const newAgruppedLine = {
        quantity:
          parseInt(newLine.quantity) +
          (oldItems.find((x) => x.product.id === newLine.product.id)
            ?.quantity ?? 0),
        product: newLine.product,
        details: newLine.details,
        images: newLine.images ?? [],
      };

      const productStock = await Api.get(
        "/inventory/product/" + newAgruppedLine.product.id
      ).then((x) => x.data);

      if (productStock.Quantity < newAgruppedLine.quantity)
        return toast.error(lang.inventory.outputCreate.stock);

      let newTemp = [
        ...oldItems.filter((x) => x.product.id !== newLine.product.id),
        newAgruppedLine,
      ];

      setItems(newTemp);
      setTimeout(() => addItem(newTemp), 150);
    }
  };

  const saveOutput = async (e) => {
    e.target.disabled = true;

    const response = await Api.post("/inventory/outputs", {
      Description: description,
      Lines: items.map((itm) => {
        return {
          ProductId: itm.product.id,
          Details: itm.details,
          Images: itm.images.map((x) => x.id),
          Quantity: itm.quantity,
        };
      }),
    });

    if (response.status === 200) {
      toast.success(lang.inventory.outputCreate.success);
      setTimeout(() => navigate("/inventory/outputs"), 1000);
    } else {
      e.target.disabled = false;
      toast.error(lang.inventory.outputCreate.error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.inventory.general.newOutput}</Heading>
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
            order: ["id", "Code", "Name", "Details", "Quantity", "dropDown"],
            dataModel: {
              id: lang.inventory.general.id,
              Code: lang.inventory.labels.code,
              Name: lang.inventory.labels.product,
              Details: lang.inventory.labels.details,
              Quantity: lang.inventory.labels.quantity,
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
        onClick={saveOutput}
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
              label: lang.inventory.placeholder.quantityOutput,
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
