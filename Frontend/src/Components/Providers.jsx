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
  usePrompt,
} from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons";
import promptWithComponent from "./Utilities/promptWithComponent";
import NewNamePrompt from "./Subcomponents/NewNameComponent";
import ConfirmPrompt from "./Utilities/confirmPromptComponent";
import FormPromptComponent from "./Subcomponents/FormPromptComponent";

function Providers() {
  const lang = useContext(Contexts.langContext);

  const [providers, setOrigins] = useState([]);

  const fetchData = useCallback(async () => {
    const originsResponse = await Api.get("/providers");
    setOrigins(originsResponse.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const createNewProvider = async () => {
    const newProvider = await promptWithComponent((resolve) => (
      <FormPromptComponent
        resolve={resolve}
        lang={lang}
        title={lang.providers.new}
        fields={[
          {
            nameProp: "name",
            label: lang.providers.general.name,
            type: "text",
          },
          { nameProp: "doc", label: lang.providers.general.doc, type: "text" },
        ]}
      />
    ));

    if (
      newProvider &&
      newProvider?.name.trim() !== "" &&
      newProvider?.doc.trim() !== ""
    ) {
      await Api.post("/providers", {
        Name: newProvider.name,
        Doc: newProvider.doc,
      });
      await fetchData();
      toast.success(lang.providers.create.success);
    } else {
      if (newProvider !== null) {
        toast.error(lang.providers.create.validations.badParams);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.navPaths.providers}</Heading>
      </Container>

      <div className="flex justify-between mt-5">
        <Button onClick={createNewProvider} variant="secondary">
          <Plus />
          {lang.providers.new}
        </Button>
      </div>
      {providers && !providers?.error ? (
        <AdaptableTable
          data={providers.map((prv) => {
            return {
              id: prv.id,
              Name: prv.Name,
              Doc: prv.Doc,
              dropDown: (
                <ProviderDropDown
                  fetchData={fetchData}
                  lang={lang}
                  provider={prv}
                />
              ),
            };
          })}
          columnModel={{
            order: ["id", "Name", "Doc", "dropDown"],
            dataModel: {
              id: lang.providers.general.id,
              Name: lang.providers.general.name,
              Doc: lang.providers.general.doc,
              dropDown: "",
            },
            css: {
              Name: "w-1/4",
              Doc: "w-full",
              id: "w-1/4",
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

function ProviderDropDown({ provider, lang, fetchData }) {
  const editProvider = async () => {
    const edittedProvider = await promptWithComponent((resolve) => (
      <FormPromptComponent
        resolve={resolve}
        lang={lang}
        title={lang.providers.new}
        fields={[
          { nameProp: "name", label: lang.providers.general.name, type: "text", defaultValue: provider.Name },
          { nameProp: "doc", label: lang.providers.general.doc, type: "text", defaultValue: provider.Doc },
        ]}
      />
    ));

    if (edittedProvider && edittedProvider.name.trim() !== "" && edittedProvider.doc.trim() !== "") {
      await Api.patch("/providers/" + provider.id, { Name: edittedProvider.name, Doc: edittedProvider.doc });
      await fetchData();
      toast.success(lang.providers.create.validations.editted);
    } else {
      if (edittedProvider !== null) {
        toast.error(lang.providers.create.validations.badParams);
      }
    }
  };

  const deleteProvider = async () => {
    const confirmed = await promptWithComponent((resolve) => (
      <ConfirmPrompt resolve={resolve} lang={lang} />
    ));

    if (confirmed) {
      await Api.delete("/providers/" + provider.id);
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
          <DropdownMenu.Item onClick={editProvider} className="gap-x-2">
            <PencilSquare className="text-ui-fg-subtle" />
            {lang.general.edit}
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={deleteProvider} className="gap-x-2">
            <Trash className="text-ui-fg-subtle" />
            {lang.general.delete}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}

export default Providers;
