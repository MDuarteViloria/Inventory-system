import { useContext, useRef, useState } from "react";
import Contexts from "../Sources/Contexts";
import {
  Heading,
  Container,
  Input,
  Textarea,
  Toaster,
  toast,
  Text,
  Button,
} from "@medusajs/ui";
import InputLabel from "./Subcomponents/Label";
import api from "../Sources/Api";
import Selector from "./Subcomponents/Selector";
import ImageSelector from "./Subcomponents/ImageSelector";
import { useNavigate } from "react-router-dom";

export default function ProductNew() {
  const [product, setProduct] = useState({});

  const lang = useContext(Contexts.langContext);
  const timeoutRef = useRef(null);
  const timeoutBarcodeRef = useRef(null);
  const [validCode, setValidCode] = useState(false);
  const [validBarcode, setValidBarCode] = useState(false);

  const navigate = useNavigate();

  const changeProperty = (name, value) => {
    setProduct({
      ...product,
      [name]: value,
    });
  };
  const validateCode = async (code) => {
    if (!code) {
      toast.error(lang.products.create.validations.code.false);
      return setValidCode(false);
    }

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
  const validateBarCode = async (barcode) => {
    if (!barcode) {
      toast.error(lang.products.create.validations.barcode.false);
      return setValidBarCode(false);
    }
    await api
      .get(`/products/barcode/${barcode}`)
      .then((res) => {
        if (res.status === 200) {
          toast.error(lang.products.create.validations.barcode.false);
          return setValidBarCode(false);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast.success(lang.products.create.validations.barcode.true);
          return setValidBarCode(true);
        }
      });
  };
  const saveProduct = async () => {
    if (!validCode) {
      toast.error(lang.products.create.validations.code.notValid);
      return;
    }

    if (!validBarcode) {
      toast.error(lang.products.create.validations.barcode.notValid);
      return;
    }

    if ((!product.title, !product.code, !product.barcode)) {
      toast.error(lang.products.create.validations.badParams);
      return;
    }

    const productBody = {
      Name: product.title,
      Description: product.description ?? "",
      Code: product.code,
      BarCode: product.barCode,
      OriginProductId: product?.origin?.id,
      LocationId: product?.location?.id,
      Images: product.images?.map((image) => image.id),
    };
    await api
      .post("/products", productBody)
      .then((res) => {
        if (res.status === 200) {
          toast.success(lang.products.create.validations.success, {
            duration: 1000,
          });
        }
        setTimeout(() => navigate("/products"), 1000);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error(lang.products.create.validations.badParams);
        } else {
          toast.error(lang.products.create.validations.error);
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
      <div className="flex flex-col my-6 pb-6">
        <p className="text-sm font-medium ml-2 pb-0.5">
          {lang.products.create.general}
        </p>

        <Container className="flex flex-col gap-4 mb-8">
          {/* TITLE - DESCRIPTION INPUT */}
          <InputLabel
            label={lang.products.create.labels.title}
            className="flex flex-col"
          >
            <Input
              type="text"
              onChange={(e) => changeProperty("title", e.target.value)}
              className="px-2"
              placeholder={lang.products.create.placeholders.title}
            />
          </InputLabel>

          <InputLabel
            label={lang.products.create.labels.description}
            className="flex flex-col"
          >
            <Textarea
              type="text"
              onChange={(e) => changeProperty("description", e.target.value)}
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
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(
                      () => validateCode(e.target.value),
                      2000
                    );
                    changeProperty("code", e.target.value);
                  }}
                  placeholder={lang.products.create.placeholders.code}
                />
              </InputLabel>
              <InputLabel label={lang.products.create.labels.barcode}>
                <Input
                  type="text"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    setValidBarCode(false);
                    clearTimeout(timeoutBarcodeRef.current);
                    timeoutBarcodeRef.current = setTimeout(
                      () => validateBarCode(e.target.value),
                      2000
                    );
                    changeProperty("barcode", e.target.value);
                  }}
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
                getData={async () => {
                  // PENDIENTE OBTENER ORIGENES
                  return await api.get("/origins").then((x) => x.data);
                }}
                selectorData={[
                  ["Name"],
                  lang.products.create.placeholders.origin,
                  lang.general.cancel,
                  lang.general.searchInput,
                  lang.general.noItems,
                ]}
                showValue={product.origin?.Name}
                placeholder={lang.products.create.placeholders.origin}
                label={lang.products.create.labels.origin}
              />
              <Selector
                changeProperty={(val) => changeProperty("location", val)}
                getData={async () => {
                  // PENDIENTE OBTENER LOCATIONS
                  return await api.get("/locations").then((x) => x.data);
                }}
                selectorData={[
                  ["Name"],
                  lang.products.create.placeholders.location,
                  lang.general.cancel,
                  lang.general.searchInput,
                  lang.general.noItems,
                ]}
                showValue={product.location?.Name}
                placeholder={lang.products.create.placeholders.location}
                label={lang.products.create.labels.location}
              />
            </div>
          </div>
        </Container>
        <p className="text-sm font-medium ml-2 pb-0.5">{lang.general.images}</p>
        <Container className="flex flex-col gap-4 mb-8">
          <ImageSelector
            onSelected={(val) => changeProperty("image", val)}
            label={lang.products.create.labels.image}
          />
          <div className="w-full grid lg:grid-cols-4 grid-cols-2 gap-5">
            {product.image &&
              product.image.map((img) => (
                <img
                  src={img.url}
                  className="object-cover aspect-square w-full rounded-lg shadow-buttons-neutral"
                />
              ))}
            {(product.image?.length ?? 0) === 0 && (
              <Text>{lang.general.noItems}</Text>
            )}
          </div>
        </Container>
        <Button
          onClick={saveProduct}
          variant="primary"
          className="w-full md:w-1/4 mr-0 ml-auto"
        >
          {lang.general.save}
        </Button>
      </div>
      <Toaster />
    </>
  );
}
