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
  toast,
  Toaster,
  Input,
} from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons";
import promptWithComponent from "./Utilities/promptWithComponent";
import NewNamePrompt from "./Subcomponents/NewNameComponent";
import ConfirmPrompt from "./Utilities/confirmPromptComponent";
import { useNavigate } from "react-router-dom";

function InventoryEntry() {
  const lang = useContext(Contexts.langContext);

  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    const entriesResponse = await Api.get("/inventory/entries");
    setEntries(entriesResponse.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.inventory.entries}</Heading>
      </Container>

      <div className="flex justify-between mt-5">
        <Button
          onClick={() => navigate("/inventory/entries/new")}
          variant="secondary"
        >
          <Plus />
          {lang.inventory.general.newEntry}
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
      {entries && !entries?.error ? (
        <AdaptableTable
          data={entries
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
                  <EntryDropDown
                    fetchData={fetchData}
                    lang={lang}
                    originId={ent.id}
                  />
                ),
              };
            })}
          columnModel={{
            order: ["id", "User", "Description", "Date"],
            dataModel: {
              id: lang.inventory.general.id,
              User: lang.inventory.general.user,
              Description: lang.inventory.labels.description,
              Date: lang.inventory.general.date,
              dropDown: "",
            },
            css: {
              Description: "break-all",
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

function EntryDropDown({ originId, lang, fetchData }) {
  const editOrigin = async () => {
    const originName = await promptWithComponent((resolve) => (
      <NewNamePrompt resolve={resolve} lang={lang} title={lang.origins.edit} />
    ));

    if (originName && originName.trim() !== "") {
      await Api.patch("/origins/" + originId, { Name: originName });
      await fetchData();
      toast.success(lang.origins.create.validations.editted);
    } else {
      if (originName !== null) {
        toast.error(lang.origins.create.validations.badParams);
      }
    }
  };

  const deleteOrigin = async () => {
    const confirmed = await promptWithComponent((resolve) => (
      <ConfirmPrompt resolve={resolve} lang={lang} />
    ));

    if (confirmed) {
      await Api.delete("/origins/" + originId);
      await fetchData();
      toast.success(lang.general.deletedSuccess);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={editOrigin} className="gap-x-2">
            <PencilSquare className="text-ui-fg-subtle" />
            {lang.general.edit}
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={deleteOrigin} className="gap-x-2">
            <Trash className="text-ui-fg-subtle" />
            {lang.general.delete}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}

export default InventoryEntry;
