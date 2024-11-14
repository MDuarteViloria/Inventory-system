import { useCallback, useContext, useEffect, useState } from "react";
import Contexts from "../Sources/Contexts";
import AdaptableTable from "./Subcomponents/AdaptableTable";
import Api from "../Sources/Api";
import { Button, Container, DropdownMenu, Heading, IconButton, toast, Toaster, Input } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons";
import promptWithComponent from "./Utilities/promptWithComponent";
import NewNamePrompt from "./Subcomponents/NewNameComponent";
import ConfirmPrompt from "./Utilities/confirmPromptComponent";

function Categories() {
  const lang = useContext(Contexts.langContext);

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    const categoriesResponse = await Api.get("/categories");
    setCategories(categoriesResponse.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const createNewCategory = async () => {
    const categoryName = await promptWithComponent((resolve) => (
      <NewNamePrompt resolve={resolve} lang={lang} title={lang.categories.new} />
    ));

    if (categoryName && categoryName.trim() !== "") {
      await Api.post("/categories", { Name: categoryName });
      await fetchData();
      toast.success(lang.categories.create.success);
    } else {
      if (categoryName !== null) {
        toast.error(lang.categories.create.validations.badParams);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.navPaths.categories}</Heading>
      </Container>
      <div className="flex justify-between mt-5">
        <Button onClick={createNewCategory} variant="secondary">
          <Plus />
          {lang.categories.new}
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
      {categories && !categories?.error ? (
        <AdaptableTable
          data={categories.filter(itm => itm.Name.toLowerCase().includes(search.toLowerCase())).map((org) => {
            return {
              id: org.id,
              Name: org.Name,
              dropDown: (
                <CategoryDropDown
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
              id: lang.categories.general.id,
              Name: lang.categories.general.name,
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

function CategoryDropDown({ originId: categoryId, lang, fetchData }) {
  const editOrigin = async () => {
    const originName = await promptWithComponent((resolve) => (
      <NewNamePrompt resolve={resolve} lang={lang} title={lang.categories.edit} />
    ));

    if (originName && originName.trim() !== "") {
      await Api.patch("/categories/" + categoryId, { Name: originName });
      await fetchData();
      toast.success(lang.categories.create.validations.editted);
    } else {
      if (originName !== null) {
        toast.error(lang.categories.create.validations.badParams);
      }
    }
  };

  const deleteCategory = async () => {
    const confirmed = await promptWithComponent((resolve) => (
      <ConfirmPrompt resolve={resolve} lang={lang} />
    ));

    if(confirmed) {
      await Api.delete("/categories/" + categoryId);
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
          <DropdownMenu.Item onClick={deleteCategory} className="gap-x-2">
            <Trash className="text-ui-fg-subtle" />
            {lang.general.delete}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}

export default Categories;
