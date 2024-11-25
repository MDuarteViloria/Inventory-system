import { utils, writeFile } from "xlsx";

export default function generateSheet(data, name) {
  const wb = utils.book_new();
  const ws = utils.json_to_sheet(data, { origin: "A2" });
  utils.book_append_sheet(wb, ws, name);
  writeFile(wb, name + ".xlsx");
}
