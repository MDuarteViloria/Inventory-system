import { Badge, Button, Drawer, Heading, Text } from "@medusajs/ui";
import { createRoot } from "react-dom/client";
import InputLabel from "../Subcomponents/Label";
import "../../assets/App.css";

export default async function seeProduct(product, lang) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const root = createRoot(div);

  return await new Promise((resolve, reject) => {
    root.render(<SeeProduct lang={lang} resolve={resolve} data={product} />);
  }).then((selected) => {
    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 200);

    return selected;
  });
}

function SeeProduct({ data, resolve, lang }) {
  return (
    <>
      <Drawer onOpenChange={() => resolve()} defaultOpen={true}>
        <Drawer.Content className="z-20">
          <Drawer.Header>
            <Drawer.Title>{lang.products.selfName}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex-grow overflow-y-auto flex flex-col w-full">
            <Heading className="mb-0 pb-0" level="h1">
              {data.Name}
            </Heading>
            <Heading className="font-thin mb-3 italic" level="h3">
              {data.Code}
            </Heading>
            <hr />
            <Text className="mt-3 mb-4">{data.Description}</Text>
            <hr />
            <div className="grid md:grid-cols-2 gap-3 pt-4 [&_label]:text-xs">
              <InputLabel
                className="grid"
                label={lang.products.headers.originProduct}
              >
                <Badge>{data.OriginProduct?.Name}</Badge>
              </InputLabel>
              <InputLabel
                className="grid"
                label={lang.products.headers.location}
              >
                <Badge>{data.Location?.Name ?? ""}</Badge>
              </InputLabel>
            </div>
            {(data.Images?.length ?? 0) > 0 && <InputLabel
              className={"mt-4"}
              label={lang.products.create.labels.images}
            >
              <div className="w-full grid grid-cols-2 gap-2">
                {data.Images?.map((image, index) => (
                  <img
                    key={index}
                    className="w-full object-cover aspect-square border shadow-borders-base rounded-lg"
                    src={image.Url}
                    alt={data.Name}
                  />
                ))}
              </div>
            </InputLabel>}
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close>
              <Button variant="danger">Cerrar</Button>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  );
}
