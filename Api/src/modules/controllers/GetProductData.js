import config from "../../config.js";
import DB from "../database/connect-db.js";

export default async function getProductData(
  productId,
  type = "id",
  deleted = false,
  lang = "es",
  withTranslation = false
) {
  const database = new DB();
  const sql = "SELECT * FROM Products WHERE (" + type + " = ?) AND Deleted = ?";

  const data = await database.query(sql, [productId, deleted]);
  let product = data.rows[0];

  if (product) {
    product = {
      id: product.id,
      Name: withTranslation
        ? product.Name
        : { es: product.Name, zh: product.Name_ZH }[lang] ?? product.Name,
      Name_ZH: withTranslation ? product.Name_ZH : undefined,
      Description: product.Description,
      Code: product.Code,
      BarCode: product.BarCode,
      Categories:
        (await database
          .query(
            "SELECT C.id AS id, C.Name FROM CategoriesProducts CP INNER JOIN Categories C ON CP.IdCategory = C.id WHERE CP.IdProduct = ?",
            [product.id]
          )
          .then((categories) => categories?.rows)) ?? [],
      Images:
        (await database
          .query("SELECT ImageId FROM ProductImages WHERE ProductId = ?", [
            product.id,
          ])
          .then((im) =>
            im?.rows.map((image) => ({
              Url: config.backendUrl + "/images/" + image.ImageId,
              id: image.ImageId,
            }))
          )) ?? [],
      OriginProduct:
        (await database
          .query("SELECT id, Name FROM OriginProducts WHERE id = ?", [
            product.OriginProductId,
          ])
          .then((origin) => origin?.rows[0])) ?? null,
      Location:
        (await database
          .query("SELECT id, Name FROM Locations WHERE id = ?", [
            product.LocationId,
          ])
          .then((location) => location?.rows[0])) ?? null,
    };
  }
  return product ?? null;
}
