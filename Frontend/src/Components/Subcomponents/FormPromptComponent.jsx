import { Prompt, Input, Select, CurrencyInput } from "@medusajs/ui";
import { useState } from "react";

export default function FormPromptComponent({
  resolve,
  lang,
  title,
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
      return (
        {
          select: (
            <Select
              onValueChange={(value) => changeProp(field.nameProp, value)}
              {...field}
            >
              <Select.Trigger>
                <Select.Value placeholder={field.label} />
              </Select.Trigger>
              <Select.Content>
                {field?.values?.map((value) => (
                  <Select.Item value={value.item}>{value.label}</Select.Item>
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
        }[field.type] ?? (
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
              {lang.general.cancel}
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
