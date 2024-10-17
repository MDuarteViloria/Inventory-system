import { Badge } from "@medusajs/ui";
import InputLabel from "./Label";
import selectDataList from "../Utilities/selectDataList";

export default function Selector({
  showValue,
  getData,
  changeProperty,
  label,
  placeholder,
  selectorData = [],
}) {
  return (
    <InputLabel className={"flex flex-col gap-[0.25rem]"} label={label}>
      <Badge
        onClick={async () => {
          const selected = await selectDataList(
            await getData(),
            ...selectorData
          );
          if (selected) {
            changeProperty(selected);
          }
        }}
        className="pseudo-button"
      >
        {showValue ?? placeholder}
      </Badge>
    </InputLabel>
  );
}
