import { Prompt, Input, Select, CurrencyInput } from "@medusajs/ui";
import { useState } from "react";
import Selector from "./Selector";
import ImageSelector from "./ImageSelector";
import Contexts from "../../Sources/Contexts";
import InputLabel from "./Label";

export default function FormPromptComponent({
  resolve,
  lang,
  title,
  recursive,
  fields = [{ nameProp: "name", label: "Nombre", type: "text" }],
}) {
  const [dataFields, setDataFields] = useState(
    fields.reduce((curr, key) => {
      return {
        ...curr,
        [key.nameProp]: key.defaultValue ?? "",
      };
    }, {})
  );

  const renderFields = () => {
    return fields.map((field) => {
      const components = {
        select: (
          <Select
            onValueChange={(value) => changeProp(field.nameProp, value)}
            {...field}
          >
            <Select.Trigger>
              <Select.Value placeholder={field.label} />
            </Select.Trigger>
            <Select.Content className="z-30">
              {field?.values?.map((v) => (
                <Select.Item value={v.item}>{v.label}</Select.Item>
              ))}
            </Select.Content>
          </Select>
        ),
        currency: (
          <CurrencyInput
            onChange={(e) => changeProp(field.nameProp, e.target.value)}
            {...field}
          />
        ),
        selector: (
          <Selector
            showValue={
              dataFields[field.nameProp][
                field?.selectorData && field?.selectorData[0]
              ]
            }
            changeProperty={(value) => changeProp(field.nameProp, value)}
            {...field}
          />
        ),
        images: (
          <Contexts.langContext.Provider value={{ lang }}>
            <ImageSelector
              receivedLang={lang}
              count={dataFields[field.nameProp]?.length}
              onSelected={(value) => changeProp(field.nameProp, value)}
            />
          </Contexts.langContext.Provider>
        ),
      };

      if (field.topLabel)
        return (
          <InputLabel className={"italic"} label={field.topLabel}>
            {components[field.type] ?? (
              <Input
                onChange={(e) => changeProp(field.nameProp, e.target.value)}
                type={field.type}
                placeholder={field?.label}
                {...field}
              />
            )}
          </InputLabel>
        );
      else
        return (
          components[field.type] ?? (
            <Input
              onChange={(e) => changeProp(field.nameProp, e.target.value)}
              type={field.type}
              placeholder={field?.label}
              {...field}
            />
          )
        );
    });
  };

  const changeProp = (name, value) => {
    setDataFields({
      ...dataFields,
      [name]: value,
    });
  };

  return (
    <>
      <Prompt variant="confirmation" defaultOpen={true}>
        <Prompt.Content className="z-20 max-w-[90vw] md:max-w-[400px]">
          <Prompt.Header>
            <Prompt.Title>{title}</Prompt.Title>
            <div className="grid grid-cols-1 gap-4 py-2">
              {renderFields(fields)}
            </div>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={() => resolve(null)}>
              {recursive ? lang.general.exit : lang.general.cancel}
            </Prompt.Cancel>
            <Prompt.Action onClick={() => resolve(dataFields)}>
              {lang.general.save}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
}
