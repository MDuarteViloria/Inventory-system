import { useCallback, useContext, useEffect, useState } from "react";
import Contexts from "../Sources/Contexts";
import AdaptableTable from "./Subcomponents/AdaptableTable";
import Api from "../Sources/Api";
import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Toaster,
  Input,
} from "@medusajs/ui";
import { EllipsisHorizontal, Eye, Plus } from "@medusajs/icons";
import { useNavigate } from "react-router-dom";

function InventoryOutput() {
  const { lang } = useContext(Contexts.langContext);

  const navigate = useNavigate();

  const [outputs, setOutputs] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    const outputsResponse = await Api.get("/inventory/outputs");
    setOutputs(outputsResponse.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.inventory.outputs}</Heading>
      </Container>

      <div className="flex justify-between mt-5">
        <Button
          onClick={() => navigate("/inventory/outputs/new")}
          variant="secondary"
        >
          <Plus />
          {lang.inventory.general.newOutput}
        </Button>
      </div>
      <div className="justify-between mt-5 w-full [&_>div_input]:min-w-[150px]">
        <Input
          placeholder={lang.inventory.general.searchOutputEntry}
          className="w-1/4"
          maxLength={80}
          type="search"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {outputs && !outputs?.error ? (
        <AdaptableTable
          data={outputs
            .filter(
              (ent) =>
                (ent.User &&
                  ent.User.toLowerCase().includes(search.toLowerCase())) ||
                ent.id == search
            )
            .map((ent) => {
              return {
                ...ent,
                dropDown: (
                  <OutputDropDown
                    lang={lang}
                    outputId={ent.id}
                  />
                ),
              };
            })}
          columnModel={{
            order: ["id", "User", "Description", "Date", "dropDown"],
            dataModel: {
              id: lang.inventory.general.id,
              User: lang.inventory.general.user,
              Description: lang.inventory.labels.description,
              Date: lang.inventory.general.date,
              dropDown: "",
            },
            cssRow: {
              Description: "break-all",
              dropDown: "flex items-center justify-center"
            },
          }}
        />
      ) : (
        <></>
      )}

      <Toaster />
    </div>
  );
}

function OutputDropDown({ outputId, lang }) {
const navigate = useNavigate();

  const seeOutput = () => {
    navigate("/inventory/outputs/" + outputId)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={seeOutput} className="gap-x-2">
            <Eye className="text-ui-fg-subtle" />
            {lang.general.see}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}

export default InventoryOutput;
