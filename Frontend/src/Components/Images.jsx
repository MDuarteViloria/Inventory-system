import { useCallback, useContext, useEffect, useState } from "react";
import Contexts from "../Sources/Contexts";
import api from "../Sources/Api";
import { Button, Container, Heading, toast, Toaster } from "@medusajs/ui";
import { Plus, Trash } from "@medusajs/icons";
import selectImages from "./Utilities/selectImage";
import ConfirmPrompt from "./Utilities/confirmPromptComponent";
import promptWithComponent from "./Utilities/promptWithComponent";

export default function Images() {
  const [data, setData] = useState([]);
  const [viewImage, setViewImage] = useState(null);

  const { lang } = useContext(Contexts.langContext);

  const fetchData = useCallback(async () => {
    const imageResponse = await api.get("/images");
    setData(imageResponse.data);
  });

  useEffect(() => {
    fetchData();
  }, []);

  const addImage = async () => {
    const images = await selectImages();
    if (images) {
      const fData = new FormData();
      images.forEach((image) => {
        fData.append("images", image);
      });
      await api.post("/images", fData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(lang.images.addedSuccess);
      fetchData();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Container className="bg-primary text-white">
        <Heading level="h1">{lang.navPaths.images}</Heading>
      </Container>
      <div className="flex justify-between mt-5">
        <Button onClick={addImage} variant="secondary">
          <Plus />
          {lang.images.new}
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto flex flex-col w-full">
        {(data?.length ?? 0) > 0 ? (
          <div className="w-full grid lg:grid-cols-4 grid-cols-2 gap-2">
            {data?.reverse().map((image, index) => (
              <div className="w-full relative" key={index}>
                <img
                  key={index}
                  onClick={() => setViewImage(image.url)}
                  className="w-full cursor-pointer border-4 hover:border-ui-tag-blue-border object-cover aspect-square rounded-lg"
                  src={image.url}
                  alt={"img"}
                />
                <Button
                  variant="danger"
                  onClick={async () => {
                    const confirmed = await promptWithComponent((resolve) => (
                      <ConfirmPrompt
                        resolve={resolve}
                        lang={lang}
                        title={
                          lang.images.sureDelete
                        }
                      />
                    ));

                    if (!confirmed) return;

                    await api.delete(`/images/${image.id}`);
                    toast.success(lang.images.deletedSuccess);
                    fetchData();
                  }}
                  className="absolute w-8 !border-white p-0 top-2 right-2 aspect-square"
                >
                  <Trash />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-lg font-semibold">{lang.general.noImages}</h1>
          </div>
        )}
      </div>
      {viewImage && (
        <img
          onClick={() => setViewImage(null)}
          className="z-[3000] cursor-pointer bg-black w-full h-full top-0 bottom-0 left-0 right-0 fixed object-contain"
          src={viewImage}
        />
      )}
      <Toaster />
    </div>
  );
}
