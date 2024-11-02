import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { MultiSelect } from "./Subcomponents/Multiselect";
import Api from "../Sources/Api";

export default function ProductEdit() {
  const [product, setProduct] = useState(null);

  const lang = useContext(Contexts.langContext);
  const timeoutRef = useRef(null);
  const timeoutBarcodeRef = useRef(null);
  const [validCode, setValidCode] = useState(true);
  const [validBarcode, setValidBarCode] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const productId = useParams().id;

  useEffect(() => {
    Api.get("/categories")
      .then((res) => {
        if (res.status === 200) {
          setCategories(res.data.map((x) => ({ id: x.id, name: x.Name })));
        }
      })
      .catch((err) => {
        console.log(err);
      });

    Api.get("/products/" + productId).then((res) => {
      if (res.status === 200) {
        const transformToLower = (obj) =>
          Object.keys(obj).reduce((curr, key) => {
            return {
              ...curr,
              [key[0].toLowerCase() + key.slice(1)]: obj[key],
            };
          }, {});

        let data = transformToLower(res.data);
        setSelectedCategories(data.categories.map((x) => x.id));
        delete data["categories"];
        data["images"] = data.images.map((x) => transformToLower(x));
        data["location"] = data.location;
        data["origin"] = data.originProduct;
        delete data["originProduct"];
        data["title"] = data.name;
        delete data["name"];

        setProduct(data);
      }
    });
  }, []);

  const changeProperty = (name, value) => {
    setProduct({
      ...product,
      [name]: value,
    });
  };
  const validateCode = async (code) => {
    if (!code) {
      toast.error(lang.products.edit.validations.code.false);
      return setValidCode(false);
    }

    await api
      .get(`/products/code/${code}`)
      .then((res) => {
        if (res.status === 200 && code !== product.code) {
          toast.error(lang.products.edit.validations.code.false);
          return setValidCode(false);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast.success(lang.products.edit.validations.code.true);
          return setValidCode(true);
        }
      });
  };
  const validateBarCode = async (barcode) => {
    if (!barcode) {
      toast.error(lang.products.edit.validations.barcode.false);
      return setValidBarCode(false);
    }
    await api
      .get(`/products/barcode/${barcode}`)
      .then((res) => {
        if (res.status === 200 && barcode !== product.barCode) {
          toast.error(lang.products.edit.validations.barcode.false);
          return setValidBarCode(false);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast.success(lang.products.edit.validations.barcode.true);
          return setValidBarCode(true);
        }
      });
  };
  const saveProduct = async (e) => {
    e.target.disabled = true;

    if (!validCode) {
      toast.error(lang.products.edit.validations.code.notValid);
      return;
    }

    if (!validBarcode) {
      toast.error(lang.products.edit.validations.barcode.notValid);
      return;
    }

    console.log(product);

    if ((!product.title, !product.code)) {
      toast.error(lang.products.edit.validations.badParams);
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
      Categories: selectedCategories,
    };
    await api
      .patch("/products/" + product.id, productBody)
      .then((res) => {
        if (res.status === 200) {
          toast.success(lang.products.edit.validations.success, {
            duration: 1000,
          });
        }
        setTimeout(() => navigate("/products"), 1000);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error(lang.products.edit.validations.badParams);
        } else {
          toast.error(lang.products.edit.validations.error);
        }
      });
      
    e.target.disabled = false;
  };

  return product ? (
    <>
      <div className="flex flex-col gap-4">
        <Container className="bg-primary text-white">
          <Heading level="h1">
            {lang.products.editProductHeader + " #" + product.id}
          </Heading>
        </Container>
      </div>
      <div className="flex flex-col my-6 pb-6">
        <p className="text-sm font-medium ml-2 pb-0.5">
          {lang.products.edit.general}
        </p>

        <Container className="flex flex-col gap-4 mb-8">
          {/* TITLE - DESCRIPTION INPUT */}
          <InputLabel
            label={lang.products.edit.labels.title}
            className="flex flex-col"
          >
            <Input
              type="text"
              defaultValue={product.title}
              onChange={(e) => changeProperty("title", e.target.value)}
              className="px-2"
              placeholder={lang.products.edit.placeholders.title}
            />
          </InputLabel>

          <InputLabel
            label={lang.products.edit.labels.description}
            className="flex flex-col"
          >
            <Textarea
              type="text"
              defaultValue={product.description}
              onChange={(e) => changeProperty("description", e.target.value)}
              className="px-2 min-h-[8rem]"
              placeholder={lang.products.edit.placeholders.description}
            />
          </InputLabel>

          <hr className="mt-5 mb-3" />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* CODE - BARCODE INPUT */}
            <div className="flex flex-col gap-3">
              <InputLabel label={lang.products.edit.labels.code}>
                <Input
                  type="text"
                  className="px-2"
                  maxLength={24}
                  defaultValue={product.code}
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
                  placeholder={lang.products.edit.placeholders.code}
                />
              </InputLabel>
              <InputLabel label={lang.products.edit.labels.barcode}>
                <Input
                  type="text"
                  defaultValue={product.barCode}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    setValidBarCode(false);
                    clearTimeout(timeoutBarcodeRef.current);
                    timeoutBarcodeRef.current = setTimeout(
                      () => validateBarCode(e.target.value),
                      2000
                    );
                    changeProperty("barCode", e.target.value);
                  }}
                  maxLength={14}
                  className="px-2"
                  placeholder={lang.products.edit.placeholders.barcode}
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
                  lang.products.edit.placeholders.origin,
                  lang.general.cancel,
                  lang.general.searchInput,
                  lang.general.noItems,
                ]}
                showValue={product.origin?.Name}
                placeholder={lang.products.edit.placeholders.origin}
                label={lang.products.edit.labels.origin}
              />
              <Selector
                changeProperty={(val) => changeProperty("location", val)}
                getData={async () => {
                  // PENDIENTE OBTENER LOCATIONS
                  return await api.get("/locations").then((x) => x.data);
                }}
                selectorData={[
                  ["Name"],
                  lang.products.edit.placeholders.location,
                  lang.general.cancel,
                  lang.general.searchInput,
                  lang.general.noItems,
                ]}
                showValue={product.location?.Name}
                placeholder={lang.products.edit.placeholders.location}
                label={lang.products.edit.labels.location}
              />
            </div>
          </div>

          {/* CATEGORIES */}

          <MultiSelect
            data={categories}
            selecteds={selectedCategories}
            onSelected={(val) => {
              selectedCategories.includes(val.id)
                ? setSelectedCategories(
                    selectedCategories.filter((x) => x !== val.id)
                  )
                : setSelectedCategories((x) => [...new Set([...x, val.id])]);
            }}
          >
            <Button variant="secondary" className="mt-4 w-full">
              {lang.products.edit.labels.categories}
            </Button>
          </MultiSelect>
        </Container>
        <p className="text-sm font-medium ml-2 pb-0.5">{lang.general.images}</p>
        <Container className="flex flex-col gap-4 mb-8">
          <ImageSelector
            onSelected={(val) => changeProperty("images", val)}
            label={lang.products.edit.labels.image}
          />
          <div className="w-full grid lg:grid-cols-4 grid-cols-2 gap-5">
            {product.images &&
              product.images.map((img) => (
                <img
                  src={img.url}
                  className="object-cover aspect-square w-full rounded-lg shadow-buttons-neutral"
                />
              ))}
            {(product.images?.length ?? 0) === 0 && (
              <Text>{lang.general.noItems}</Text>
            )}
          </div>
        </Container>
        <Button
          onClick={saveProduct}
          variant="secondary"
          className="w-full md:w-1/4 mr-0 ml-auto"
        >
          {lang.general.save}
        </Button>
      </div>
      <Toaster />
    </>
  ) : (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <box-icon name="loader-alt" animation="spin"></box-icon>
      </div>
    </>
  );
}
