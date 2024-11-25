import { useCallback, useContext, useEffect, useState } from "react";
import Contexts from "../Sources/Contexts";
import AdaptableTable from "./Subcomponents/AdaptableTable";
import Api from "../Sources/Api";
import { Button, Container, DropdownMenu, Heading, IconButton, toast, Toaster, Input } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons";
import promptWithComponent from "./Utilities/promptWithComponent";
import NewNamePrompt from "./Subcomponents/NewNameComponent";
import ConfirmPrompt from "./Utilities/confirmPromptComponent";

function Origins() {
  const { lang } = useContext(Contexts.langContext);

  const [origins, setOrigins] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    const originsResponse = await Api.get("/origins");
    setOrigins(originsResponse.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const createNewOrigin = async () => {
    const originName = await promptWithComponent((resolve) => (
      <NewNamePrompt resolve={resolve} lang={lang} title={lang.origins.new} />

    ));

    if (originName && originName.trim() !== "") {
      await Api.post("/origins", { Name: originName });
      await fetchData();
      toast.success(lang.origins.create.success);
    } else {
      if (originName !== null) {
        toast.error(lang.origins.create.validations.badParams);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.navPaths.origins}</Heading>
      </Container>

      <div className="flex justify-between mt-5">
        <Button onClick={createNewOrigin} variant="secondary">
          <Plus />
          {lang.origins.new}
        </Button>
      </div>
      <div className="justify-between mt-5 w-full [&_>div_input]:min-w-[150px]">
          <Input
            placeholder={lang.general.search}
            className="w-1/4"
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      {origins && !origins?.error ? (
        <AdaptableTable
          data={origins.filter(itm => itm.Name.toLowerCase().includes(search.toLowerCase())).map((org) => {
            return {
              id: org.id,
              Name: org.Name,
              dropDown: (
                <OriginDropDown
                  fetchData={fetchData}
                  lang={lang}
                  originId={org.id}
                />
              ),
            };
          })}
          columnModel={{
            order: ["id", "Name", "dropDown"],
            dataModel: {
              id: lang.origins.general.id,
              Name: lang.origins.general.name,
              dropDown: "",
            },
            css: {
              Name: "w-full",
              id: "w-1/4",
            }
          }}
        />
      ) : (
        <></>
      )}

      <Toaster />
    </div>
  );
}

function OriginDropDown({ originId, lang, fetchData }) {
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

    if(confirmed) {
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
          <DropdownMenu.Item
            onClick={editOrigin}
            className="gap-x-2"
          >
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

export default Origins;
