import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Text,
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
} from "@medusajs/icons";
import InputLabel from "./Subcomponents/Label";
import seeImages from "./Utilities/seeImages";
import { useParams } from "react-router-dom";
import generateTablePdf from "./Utilities/generateTablePdf";

export default function SeeEntry() {
  const { lang } = useContext(Contexts.langContext);

  const [entry, setEntry] = useState(null);

  const entryId = useParams().id;

  const fetchData = useCallback(async () => {
    const { data } = await Api.get("/inventory/entries/" + entryId);
    setEntry(data);
  }, []);

  const exportData = useCallback(async () => {
    generateTablePdf(
      [
        { prop: "id", label: lang.inventory.general.id },
        { prop: "Code", label: lang.products.headers.code },
        { prop: "Name", label: lang.products.headers.name },
        { prop: "Details", label: lang.inventory.labels.details },
        { prop: "Quantity", label: lang.inventory.labels.quantity },
        { prop: "Provider", label: lang.inventory.labels.provider },
      ],
      entry.Lines.map((x) => ({
        ...x,
        id: x.Product.id,
        Provider: x.Provider.Doc + " - " + x.Provider.Name,
        Code: x.Product.Code,
        Name: x.Product.Name,
      })),
      new Date().getTime() + "_inv_entry.pdf",
      {
        title: "Entrada de Inventario",
        paramValues: [
          {
            label: lang.inventory.general.id,
            value: entryId,
          },
          {
            label: lang.inventory.general.user,
            value: entry.User,
          },
          {
            label: lang.inventory.general.date,
            value: entry.Date,
          }
        ],
      }
    );
  }, [entry]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.inventory.general.seeEntry}</Heading>
      </Container>
      <Container className="w-full relative">
        <InputLabel
          label={lang.inventory.labels.description}
          className="w-full text m-0 font-semibold"
        >
          <Text>{entry?.Description ?? ""}</Text>
        </InputLabel>
        <Heading className="absolute top-8 right-8" level="h3">
          {entry?.User ?? "User"} |{" "}
          {entry?.Date ??
            new Date().getDay() +
              "-" +
              new Date().getMonth() +
              "-" +
              new Date().getFullYear()}
        </Heading>
      </Container>
      <div className="flex justify-between w-full mb-5 [&_>div]:min-w-[150px] [&_>div]:w-1/4">
        <Button
          onClick={exportData}
          variant="secondary"
          className="ml-auto mr-0"
        >
          <DocumentText />
          {lang.general.export}
        </Button>
      </div>
      {entry && !entry.error ? (
        <AdaptableTable
          pagination={false}
          data={entry.Lines.map((itm, ind) => {
            return {
              id: itm.Product.id,
              Code: itm.Product.Code,
              Name: itm.Product.Name,
              Details: itm.Details,
              Quantity: itm.Quantity,
              Provider: itm.Provider.Doc + " - " + itm.Provider?.Name,
              dropDown: <SeeEntryDropDown line={itm} lang={lang} index={ind} />,
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
            {lang.general.error}
          </Heading>
        </div>
      )}
      <Toaster />
    </div>
  );
}

function SeeEntryDropDown({ line, lang }) {
  const seeLineImages = () =>
    seeImages(line?.Images?.map((x) => x.Url) ?? [], lang);

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={seeLineImages} className="gap-x-2">
            <Eye className="text-ui-fg-subtle" />
            {lang.inventory.general.seeImages}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}
