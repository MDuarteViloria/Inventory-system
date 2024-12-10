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
  Input,
  toast,
  Toaster,
} from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons";
import promptWithComponent from "./Utilities/promptWithComponent";
import ConfirmPrompt from "./Utilities/confirmPromptComponent";
import FormPromptComponent from "./Subcomponents/FormPromptComponent";
import multiSelectDataList from "./Utilities/multiSelectDataList";

function Users() {
  const { lang } = useContext(Contexts.langContext);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    const usersResponse = await Api.get("/users");
    setUsers(usersResponse.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const createNewUser = async () => {
    const newUser = await promptWithComponent((resolve) => (
      <FormPromptComponent
        resolve={resolve}
        lang={lang}
        title={lang.users.new}
        fields={[
          {
            nameProp: "fullname",
            label: lang.users.general.fullname,
            type: "text",
          },
          {
            nameProp: "username",
            label: lang.users.general.username,
            type: "text",
          },
          {
            nameProp: "password",
            label: lang.users.general.password,
            type: "password",
          },
        ]}
      />
    ));

    if (
      newUser &&
      newUser?.fullname.trim() !== "" &&
      newUser?.password.trim() !== "" &&
      newUser?.username.trim() !== ""
    ) {
      await Api.post("/users", {
        FullName: newUser.fullname,
        Username: newUser.username,
        Password: newUser.password,
      });
      await fetchData();
      toast.success(lang.users.create.success);
    } else {
      if (newUser !== null) {
        toast.error(lang.users.create.validations.badParams);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.navPaths.users}</Heading>
      </Container>

      <div className="flex justify-between mt-5">
        <Button onClick={createNewUser} variant="secondary">
          <Plus />
          {lang.users.new}
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
      {users && !users?.error ? (
        <AdaptableTable
          data={users
            .filter(
              (itm) =>
                itm.Username.toLowerCase().includes(search.toLowerCase()) ||
                itm.FullName.toLowerCase().includes(search.toLowerCase())
            )
            .map((prv) => {
              return {
                id: prv.id,
                Username: prv.Username,
                FullName: prv.FullName,
                dropDown: (
                  <UserDropDown fetchData={fetchData} lang={lang} user={prv} />
                ),
              };
            })}
          columnModel={{
            order: ["id", "Username", "FullName", "dropDown"],
            dataModel: {
              id: lang.users.general.id,
              Username: lang.users.general.username,
              FullName: lang.users.general.fullname,
              dropDown: "",
            },
            css: {
              Username: "w-1/4",
              FullName: "w-full",
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

function UserDropDown({ user, lang, fetchData }) {
  const editUser = async () => {
    const edittedUser = await promptWithComponent((resolve) => (
      <FormPromptComponent
        resolve={resolve}
        lang={lang}
        title={lang.users.edit}
        fields={[
          {
            nameProp: "fullname",
            label: lang.users.general.name,
            type: "text",
            placeholder: lang.users.placeholders.fullname,
            defaultValue: user.FullName,
          },
          {
            nameProp: "username",
            label: lang.users.placeholders.username,
            type: "text",
            defaultValue: user.Username,
          },
          {
            nameProp: "password",
            label: lang.users.placeholders.password,
            type: "password",
          },
        ]}
      />
    ));

    if (
      edittedUser &&
      edittedUser?.username.trim() !== "" &&
      edittedUser?.username.trim() !== ""
    ) {
      await Api.patch("/users/" + user.id, {
        FullName: edittedUser.name,
        Username: edittedUser.username,
        Password: edittedUser.password ?? undefined,
      });
      await fetchData();
      toast.success(lang.users.create.validations.editted);
    } else {
      if (edittedUser !== null) {
        toast.error(lang.users.create.validations.badParams);
      }
    }
  };

  const deleteUser = async () => {
    const confirmed = await promptWithComponent((resolve) => (
      <ConfirmPrompt resolve={resolve} lang={lang} />
    ));

    if (confirmed) {
      await Api.delete("/users/" + user.id);
      await fetchData();
      toast.success(lang.general.deletedSuccess);
    }
  };

  const editPermissions = async () => {
    const data = await Api.get("/permissions").then((x) => x.data);
    const alreadySelected = user.Permissions.map((x) =>
      data.map((x) => x.id).indexOf(x.id)
    );
    const selectedPermissions = await multiSelectDataList(
      data,
      ["UniqueName"],
      lang.users.placeholders.permissions,
      lang.general.cancel,
      lang.general.add,
      lang.general.save,
      lang.general.noItems,
      undefined,
      alreadySelected,
      [1]
    );
    if (selectedPermissions.length === 0) return;

    await Api.patch("/permissions/", {
      UserId: user.id,
      Permissions: selectedPermissions.map((x) => x.id),
    });
    await fetchData();

    toast.success(lang.users.permissions.editted);
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
          <DropdownMenu.Item onClick={editUser} className="gap-x-2">
            <PencilSquare className="text-ui-fg-subtle" />
            {lang.general.edit}
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={editPermissions} className="gap-x-2">
            <PencilSquare className="text-ui-fg-subtle" />
            {lang.users.permissions.edit}
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onClick={deleteUser} className="gap-x-2">
            <Trash className="text-ui-fg-subtle" />
            {lang.general.delete}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </>
  );
}

export default Users;
