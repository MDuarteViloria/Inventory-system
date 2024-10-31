import { Button } from "@medusajs/ui";
import InputLabel from "./Label";
import selectDataGrid from "../Utilities/selectDataGrid";
import { useContext } from "react";
import Contexts from "../../Sources/Contexts";
import api from "../../Sources/Api";
import selectImages from "../Utilities/selectImage";

export default function ImageSelector({onSelected, label}) {
  const lang = useContext(Contexts.langContext);

  const getData = async () => {
    return await api.get("/images").then((data) => data.data);
  };

  return (
    <InputLabel className={"flex flex-col gap-[0.25rem]"} label={label}>
      <Button
        variant="secondary"
        onClick={async () => {
          const selected = await selectDataGrid(
            await getData(),
            undefined,
            ["url"],
            lang.products.create.placeholders.images,
            lang.general.cancel,
            lang.general.add,
            lang.general.save,
            lang.general.noItems,
            async () => {
              const images = await selectImages();
              if (images) {
                const fData = new FormData();
                images.forEach((image) => {
                  fData.append("images", image);
                })
                const response = await api.post("/images", fData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });
                return {data: response.data?.images ?? [], drawerImage: ["url"]};
              }
            }
            
          );
          if (selected) {
            onSelected(selected);
          }
        }}
        className="w-full"
      >
        {lang.products.create.placeholders.images}
      </Button>
    </InputLabel>
  );
}
