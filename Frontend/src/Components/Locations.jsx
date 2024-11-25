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

function Locations() {
  const { lang } = useContext(Contexts.langContext);

  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    const locationResponse = await Api.get("/locations");
    setLocations(locationResponse.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const createNewLocation = async () => {
    const locationName = await promptWithComponent((resolve) => (
      <NewNamePrompt resolve={resolve} lang={lang} title={lang.locations.new} />
    ));

    if (locationName && locationName.trim() !== "") {
      await Api.post("/locations", { Name: locationName });
      await fetchData();
      toast.success(lang.locations.create.success);
    } else {
      if (locationName !== null) {
        toast.error(lang.locations.create.validations.badParams);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.navPaths.locations}</Heading>
      </Container>

      <div className="flex justify-between mt-5">
        <Button onClick={createNewLocation} variant="secondary">
          <Plus />
          {lang.locations.new}
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
      {locations && !locations?.error ? (
        <AdaptableTable
          data={locations
            .filter((itm) =>
              itm.Name.toLowerCase().includes(search.toLowerCase())
            )
            .map((org) => {
              return {
                id: org.id,
                Name: org.Name,
                dropDown: (
                  <LocationDropDown
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
              id: lang.locations.general.id,
              Name: lang.locations.general.name,
              dropDown: "",
            },
            css: {
              Name: "w-full",
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

function LocationDropDown({ originId: locationId, lang, fetchData }) {
  const editOrigin = async () => {
    const originName = await promptWithComponent((resolve) => (
      <NewNamePrompt
        resolve={resolve}
        lang={lang}
        title={lang.locations.edit}
      />
    ));

    if (originName && originName.trim() !== "") {
      await Api.patch("/locations/" + locationId, { Name: originName });
      await fetchData();
      toast.success(lang.locations.create.validations.editted);
    } else {
      if (originName !== null) {
        toast.error(lang.locations.create.validations.badParams);
      }
    }
  };

  const deleteOrigin = async () => {
    const confirmed = await promptWithComponent((resolve) => (
      <ConfirmPrompt resolve={resolve} lang={lang} />
    ));

    if (confirmed) {
      await Api.delete("/locations/" + locationId);
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

export default Locations;
