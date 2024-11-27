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

export default function SeeOutput() {
  const { lang } = useContext(Contexts.langContext);

  const [output, setOutput] = useState(null);

  const outputId = useParams().id;

  const fetchData = useCallback(async () => {
    const { data } = await Api.get("/inventory/outputs/" + outputId);
    setOutput(data);
  }, []);

  const exportData = useCallback(async () => {
    generateTablePdf(
      [
        { prop: "id", label: lang.inventory.general.id },
        { prop: "Code", label: lang.products.headers.code },
        { prop: "Name", label: lang.products.headers.name },
        { prop: "Details", label: lang.inventory.labels.details },
        { prop: "Quantity", label: lang.inventory.labels.quantity },
      ],
      output.Lines.map((x) => ({
        ...x,
        id: x.Product.id,
        Code: x.Product.Code,
        Name: x.Product.Name,
      })),
      new Date().getTime() + "_inv_output.pdf",
      {
        title: lang.inventory.labels.output,
        paramValues: [
          {
            label: lang.inventory.general.id,
            value: outputId,
          },
          {
            label: lang.inventory.general.user,
            value: output.User,
          },
          {
            label: lang.inventory.general.date,
            value: output.Date,
          }
        ],
      }
    );
  }, [output]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.inventory.general.seeOutput}</Heading>
      </Container>
      <Container className="w-full relative">
      <Heading className="md:absolute md:mb-auto mb-5 md:top-8 md:right-8" level="h3">
          {output?.User ?? "User"} |{" "}
          {output?.Date ??
            new Date().getDay() +
              "-" +
              new Date().getMonth() +
              "-" +
              new Date().getFullYear()}
        </Heading>
        <InputLabel
          label={lang.inventory.labels.description}
          className="w-full text m-0 font-semibold"
        >
          <Text>{output?.Description ?? ""}</Text>
        </InputLabel>
        
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
      {output && !output.error ? (
        <AdaptableTable
          pagination={false}
          data={output.Lines.map((itm, ind) => {
            return {
              id: itm.Product.id,
              Code: itm.Product.Code,
              Name: itm.Product.Name,
              Details: itm.Details,
              Quantity: itm.Quantity,
              dropDown: <SeeOutputDropDown line={itm} lang={lang} index={ind} />,
            };
          })}
          columnModel={{
            order: [
              "id",
              "Code",
              "Name",
              "Details",
              "Quantity",
              "dropDown",
            ],
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
            {lang.general.error}
          </Heading>
        </div>
      )}
      <Toaster />
    </div>
  );
}

function SeeOutputDropDown({ line, lang }) {
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
