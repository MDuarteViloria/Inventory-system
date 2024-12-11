import {
  Button,
  Container,
  Heading,
  StatusBadge,
  DropdownMenu,
  IconButton,
  Toaster,
  toast,
  Text,
} from "@medusajs/ui";
import { useCallback, useContext, useEffect, useState } from "react";
import Contexts from "../Sources/Contexts";
import AdaptableTable from "./Subcomponents/AdaptableTable";
import Api from "../Sources/Api";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentText, EllipsisHorizontal, Eye, Photo } from "@medusajs/icons";
import seeImages from "./Utilities/seeImages";

export default function InventoryHistorial() {
  const { lang } = useContext(Contexts.langContext);

  const [productMovements, setProductMovements] = useState(null);
  const [product, setProduct] = useState(null);

  const params = useParams();

  const fetchData = useCallback(async () => {
    const movementsResponse = await Api.get(
      "/inventory/historial/" + params.productId
    );

    setProductMovements(movementsResponse.data.Lines);
    setProduct(movementsResponse.data.Product);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.navPaths.historial}</Heading>
      </Container>
      <Container>
        <Heading level="h1">
          {product?.Code} - <span className="font-normal">{product?.Name}</span>
        </Heading>
        <Text className="text-gray-500 text-md italic mb-4">{product?.BarCode}</Text>
        <Text>{product?.Description}</Text>
      </Container>
      <div className="flex justify-between mt-5 w-full [&_>div]:min-w-[150px] [&_>div]:w-1/4">
        <Button variant="secondary">
          <DocumentText />
          {lang.general.export}
        </Button>
      </div>

      {productMovements && !productMovements?.error ? (
        <AdaptableTable
          data={productMovements.map((story) => {
            return {
              id: story.HeaderId,
              Quantity: story.Quantity,
              Details: story.Details,
              Date: story.Date,
              Type: {
                entry: (
                  <StatusBadge color="green" className="text-center">
                    {lang.inventory.historial.entry}
                  </StatusBadge>
                ),
                output: (
                  <StatusBadge color="red" className="text-center">
                    {lang.inventory.historial.output}
                  </StatusBadge>
                ),
              }[story.Type.toLowerCase()],
              dropDown: <HistorialDropdown item={story} />,
            };
          })}
          columnModel={{
            order: ["id", "Quantity", "Type", "Date", "Details", "dropDown"],
            dataModel: {
              id: lang.inventory.general.id,
              Name: lang.inventory.general.name,
              Quantity: lang.inventory.general.quantity,
              Details: lang.inventory.labels.details,
              Type: lang.inventory.general.type,
              Date : lang.inventory.general.date,
              dropDown: "",
            },
            css: {
              Quantity: "w-1/5",
              Details: "w-full",
              Type: "w-1/5",
              Date: "w-1/5",
            },
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export function HistorialDropdown({ item }) {
  const { lang } = useContext(Contexts.langContext);
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onClick={async () => {
              switch (item.Type) {
                case "ENTRY":
                  navigate("/inventory/entries/" + item.id);
                  break;
                case "OUTPUT":
                  navigate("/inventory/outputs/" + item.id);
                  break;
              }
            }}
            className="gap-x-2"
          >
            <Eye className="text-ui-fg-subtle" />
            {lang.inventory.general.seeMovement}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={async () => {
              seeImages(item.Images.map((x) => x.Url), lang);
            }}
            className="gap-x-2"
          >
            <Photo className="text-ui-fg-subtle" />
            {lang.inventory.general.seeImages}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <Toaster />
    </>
  );
}
