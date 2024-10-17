import { Button, Drawer, Input } from "@medusajs/ui";
import { createRoot } from "react-dom/client";
import "../../assets/App.css";
import { useState } from "react";

export default async function selectDataGrid(
  data = [],
  drawerTitle = [],
  drawerHeader = "Selecciona",
  cancelButtonText = "Cancelar"
) {
  const extractProp = (item, arr) => {
    return arr.reduce((acc, key) => acc[key], item);
  };

  const procededData = data.map((item) => {
    return {
      returnValue: item,
      titleKey: extractProp(item, drawerTitle),
    };
  });

  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);

  return await new Promise((resolve, reject) => {
    root.render(
      <DrawerList
        data={procededData}
        resolve={resolve}
        title={drawerHeader}
        cancelButtonText={cancelButtonText}
      />
    );
  }).then((selected) => {
    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 200);

    return selected;
  });
}

function DrawerList({
  data,
  resolve,
  title,
  cancelButtonText,
  searchInputPlaceholder = "Buscar...",
}) {

  const [search, setSearch] = useState("");

  return (
    <>
      <Drawer onOpenChange={() => resolve(null)} defaultOpen={true}>
        <Drawer.Content>
          <Drawer.Header className="z-20">
            <Drawer.Title>{title}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="max-h-min">
            <div className="bg-white sticky mr-auto w-3/4 top-0 z-10 flex">
              <Input onChange={(e) => setSearch(e.target.value)} className="w-full" placeholder={searchInputPlaceholder} />
            </div>
          </Drawer.Body>
          <hr />
          <Drawer.Body className="flex-grow overflow-y-auto gap-5 flex flex-col w-full">
            {data.filter((item) => item.titleKey.toLowerCase().includes(search.toLowerCase())).map((item, index) => (
              <>
                <Drawer.Close asChild>
                  <Button
                    className="w-full !text-left px-4 justify-start text-base min-h-max"
                    key={index}
                    onClick={() => {
                      resolve(item.returnValue);
                    }}
                    variant="secondary"
                  >
                    {item.titleKey}
                  </Button>
                </Drawer.Close>
              </>
            ))}
            {
              data.length === 0 && (
                <div className="w-full h-full flex justify-center items-center">
                  <p>No hay elementos</p>
                </div>
              )
            }
          </Drawer.Body>
          <Drawer.Footer>
            <Button onClick={() => resolve(null)} variant="primary">
              {cancelButtonText}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  );
}
