import { Button, Drawer, Input } from "@medusajs/ui";
import { createRoot } from "react-dom/client";
import "../../assets/App.css";
import { useState } from "react";

const extractProp = (item, arr) => {
  return arr.reduce((acc, key) => acc[key], item);
};

export default async function multiSelectDataList(
  data = [],
  drawerTitle = ["label"], // OR []
  drawerHeader = "Selecciona",
  cancelButtonText = "Cancelar",
  addButtonText = "Añadir",
  saveButtonText = "Guardar",
  noItems = "No hay elementos",
  addFunction,
  alreadySelectedIndexes
) {
  const procededData = data.map((item) => {
    return {
      returnValue: item,
      titleKey: extractProp(item, drawerTitle)
    };
  });

  console.log(procededData)

  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);

  return await new Promise((resolve, reject) => {
    root.render(
      <DrawerList
        data={procededData}
        resolve={resolve}
        title={drawerHeader}
        noItems={noItems}
        cancelButtonText={cancelButtonText}
        saveButtonText={saveButtonText}
        addButtonText={addButtonText}
        addFunction={addFunction}
        alreadySelectedIndexes={alreadySelectedIndexes}
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
  saveButtonText,
  addButtonText,
  addFunction,
  noItems,
  alreadySelectedIndexes
}) {
  const [opened, setOpened] = useState(undefined);
  const [fetchedData, setFetchedData] = useState([]);
  const [selected, setSelected] = useState(alreadySelectedIndexes);

  return (
    <>
      <Drawer
        onOpenChange={() => resolve(null)}
        open={opened ?? undefined}
        defaultOpen={true}
      >
        <Drawer.Content className="z-20">
          <Drawer.Header>
            <Drawer.Title>{title}</Drawer.Title>
          </Drawer.Header>
          {addFunction && (
            <Drawer.Body className="max-h-min">
              <div className="bg-white sticky w-full top-0 z-10 flex [&_div]:w-full">
                <Button
                  onClick={async () => {
                    const response = await addFunction();
                    setFetchedData([
                      ...fetchedData,
                      ...response.data.map((itm) => {
                        return {
                          returnValue: itm,
                          titleKey: response.drawerTitle
                            ? extractProp(itm, response.drawerTitle)
                            : undefined,
                          imageKey: extractProp(itm, response.drawerImage),
                        };
                      }),
                    ]);
                  }}
                  className="w-full"
                  variant="secondary"
                >
                  {addButtonText}
                </Button>
              </div>
            </Drawer.Body>
          )}
          <Drawer.Body className="max-h-fit mb-auto grid grid-cols-1 overflow-y-auto gap-5 w-full">
            {[...data, ...fetchedData].map((item, index) => {
              return (
                <Button
                  className={
                    "w-full !text-left px-4 font-normal justify-start text-base min-h-max " +
                    (selected.includes(index)
                      ? "shadow-borders-interactive-with-focus"
                      : "hover:!shadow-borders-interactive-with-active")
                  }
                  key={index}
                  onClick={() => {
                    if (selected.includes(index)) {
                      setSelected(selected.filter((i) => i !== index));
                    } else {
                      setSelected([...selected, index]);
                    }
                  }}
                  variant="secondary"
                >
                  {item.titleKey}
                </Button>
              );
            })}
            {data.length === 0 && (
              <div className="w-full h-full flex justify-center items-center">
                <p>{noItems}</p>
              </div>
            )}
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button onClick={() => resolve(null)} variant="danger">
                {cancelButtonText}
              </Button>
            </Drawer.Close>
            <Button
              onClick={() => {
                setOpened(false);
                setTimeout(
                  () =>
                    resolve(
                      selected.map(
                        (i) => [...data, ...fetchedData][i].returnValue
                      )
                    ),
                  500
                );
              }}
              variant="secondary"
            >
              {saveButtonText}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  );
}
