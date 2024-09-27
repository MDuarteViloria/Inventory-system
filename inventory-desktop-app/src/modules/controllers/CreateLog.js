import DB from "../database/connect-db";

export default async function CreateInventoryLog(Type) {
  const database = new DB();

  const sql = "INSERT INTO InventoryLog (Date, Type) VALUES (?, ?)";
  await database.query(sql, [new Date().getTime(), Type]);

  database.close();
}
