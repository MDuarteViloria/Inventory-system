import { useContext, useRef, useState } from "react";
import Contexts from "../Sources/Contexts";
import {
  Heading,
  Container,
  Input,
  Textarea,
  Toaster,
  toast,
} from "@medusajs/ui";
import InputLabel from "./Subcomponents/Label";
import api from "../Sources/Api";
import Selector from "./Subcomponents/Selector";

export default function ProductNew() {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    code: "",
  });

  const lang = useContext(Contexts.langContext);
  const timeoutRef = useRef(null);
  const [validCode, setValidCode] = useState(false);

  const changeProperty = (name, value) => {
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const validateCode = async (code) => {
    await api
      .get(`/products/code/${code}`)
      .then((res) => {
        if (res.status === 200) {
          toast.error(lang.products.create.validations.code.false);
          return setValidCode(false);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast.success(lang.products.create.validations.code.true);
          return setValidCode(true);
        }
      });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Container className="bg-primary text-white">
          <Heading level="h1">{lang.products.createProductHeader}</Heading>
        </Container>
      </div>
      <div className="flex flex-col my-6">
        <p className="text-sm font-medium ml-2 pb-0.5">
          {lang.products.create.general}
        </p>
        <Container className="flex flex-col gap-4 mb-8">

          {/* TITLE - DESCRIPTION INPUT */}
          <InputLabel
            label={lang.products.create.labels.title}
            className="flex flex-col gap-2"
          >
            <Input
              type="text"
              className="px-2"
              placeholder={lang.products.create.placeholders.title}
            />
          </InputLabel>

          <InputLabel
            label={lang.products.create.labels.description}
            className="flex flex-col gap-2"
          >
            <Textarea
              type="text"
              className="px-2 min-h-[8rem]"
              placeholder={lang.products.create.placeholders.description}
            />
          </InputLabel>
          <hr className="mt-5 mb-3" />

          <div className="grid lg:grid-cols-2 gap-8">

            {/* CODE - BARCODE INPUT */}
            <div className="flex flex-col gap-3">
              <InputLabel label={lang.products.create.labels.code}>
                <Input
                  type="text"
                  className="px-2"
                  maxLength={24}
                  onChange={(e) => {
                    setValidCode(false);
                    e.target.value = e.target.value.toUpperCase();
                    timeoutRef.current && clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(
                      () => validateCode(e.target.value),
                      1000
                    );
                  }}
                  placeholder={lang.products.create.placeholders.code}
                />
              </InputLabel>
              <InputLabel label={lang.products.create.labels.barcode}>
                <Input
                  type="text"
                  onChange={(e) =>
                    (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                  }
                  maxLength={14}
                  className="px-2"
                  placeholder={lang.products.create.placeholders.barcode}
                />
              </InputLabel>
            </div>

            <hr className="md:hidden" />
            
            {/* ORIGIN - LOCATION INPUT */}
            <div className="flex flex-col gap-3">

              <Selector
                changeProperty={(val) => changeProperty("origin", val)}
                getData={() => { // PENDIENTE OBTENER ORIGENES
                  return ["Aveo", "Corsa", "Cruze"].map((or, i) => ({
                    Name: or,
                    id: i,
                  }));
                }}
                selectorData={[
                  ["Name"],
                  lang.products.create.placeholders.origin,
                  lang.general.cancel,
                  lang.general.searchInput,
                  lang.general.noItems
                ]}
                showValue={product.origin?.Name}
                placeholder={lang.products.create.placeholders.origin}
                label={lang.products.create.labels.origin}
              />

              <Selector
                changeProperty={(val) => changeProperty("location", val)}
                getData={() => { // PENDIENTE OBTENER LOCATIONS
                  return ["Aveo", "Corsa", "Cruze"].map((or, i) => ({
                    Name: or,
                    id: i,
                  }));
                }}
                selectorData={[
                  ["Name"],
                  lang.products.create.placeholders.location,
                  lang.general.cancel,
                  lang.general.searchInput,
                  lang.general.noItems
                ]}
                showValue={product.location?.Name}
                placeholder={lang.products.create.placeholders.location}
                label={lang.products.create.labels.location}
              />

            </div>
          </div>
        </Container>
      </div>
      <Toaster />
    </>
  );
}
