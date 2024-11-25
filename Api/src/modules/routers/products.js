import express from "express";
import DB from "../database/connect-db.js";
import config from "../../../config.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Products'
  const sql = "SELECT * FROM Products WHERE Deleted = FALSE";
  const database = new DB();

  try {
    let data = await database.query(sql);
    data = await Promise.all(
      data.rows.map(async (product) => {
        return {
          id: product.id,
          Name: product.Name,
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
              .then((origin) =>
                origin?.rows.map((image) => ({
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
      })
    );
    res.json(data);
  } catch (e) {
    console.error("Error al consultar:", e);
    res.status(404).send("Error al consultar la base de datos");
  } finally {
    database.close();
  }
});

// GET ONE BY ID
router.get("/:id", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Products'
  const sql = "SELECT * FROM Products WHERE id = ? AND Deleted = FALSE";
  const database = new DB();

  try {
    const data = await database.query(sql, [req.params.id]);
    let product = data.rows[0];

    if (product) {
      product = {
        id: product.id,
        Name: product.Name,
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

      res.json(product);
    } else {
      res
        .status(404)
        .json({ success: false, error: "No se encontraron resultados" });
    }
  } catch (e) {
    console.error("Error al consultar:", e);
    res
      .status(500)
      .json({ success: false, error: "Error al consultar la base de datos" });
  } finally {
    database.close();
  }
});

// GET ONE BY CODE
router.get("/code/:code", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Products'
  const sql = "SELECT * FROM Products WHERE Code = ? AND Deleted = FALSE";
  const database = new DB();

  try {
    const data = await database.query(sql, [req.params.code]);
    let product = data.rows[0];

    if (product) {
      product = {
        id: product.id,
        Name: product.Name,
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
            .then((origin) =>
              origin?.rows.map((image) => ({
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

      res.json(product);
    } else {
      res
        .status(404)
        .json({ success: false, error: "No se encontraron resultados" });
    }
  } catch (e) {
    console.error("Error al consultar:", e);
    res
      .status(500)
      .json({ success: false, error: "Error al consultar la base de datos" });
  } finally {
    database.close();
  }
});

// GET ONE BY CODE
router.get("/barcode/:barcode", async (req, res) => {
  // Consulta SQL para obtener los datos de la tabla 'Products'
  const sql = "SELECT * FROM Products WHERE BarCode = ? AND Deleted = FALSE";
  const database = new DB();

  try {
    const data = await database.query(sql, [req.params.barcode]);
    let product = data.rows[0];

    if (product) {
      product = {
        id: product.id,
        Name: product.Name,
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
            .then((origin) =>
              origin?.rows.map((image) => ({
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

      res.json(product);
    } else {
      res
        .status(404)
        .json({ success: false, error: "No se encontraron resultados" });
    }
  } catch (e) {
    console.error("Error al consultar:", e);
    res
      .status(500)
      .json({ success: false, error: "Error al consultar la base de datos" });
  } finally {
    database.close();
  }
});

// ADD ONE
router.post("/", async (req, res) => {
  const {
    Name,
    Description,
    Code,
    BarCode,
    OriginProductId,
    LocationId,
    Categories,
    Images,
  } = req.body;

  if (!Name || !Description || !Code) {
    return res
      .status(400)
      .json({ success: false, error: "Todos los campos son obligatorios" });
  }

  const database = new DB();

  if (Code) {
    const sql = "SELECT * FROM Products WHERE (Code = ?) AND Deleted = FALSE";
    const data = await database.query(sql, [Code]);
    if (data.rows[0]) {
      return res
        .status(400)
        .json({ success: false, error: "El Code ya existe" });
    }
  }

  if (BarCode) {
    const sql = "SELECT * FROM Products WHERE (BarCode = ?) AND Deleted = FALSE";
    const data = await database.query(sql, [BarCode]);
    if (data.rows[0]) {
      return res
        .status(400)
        .json({ success: false, error: "El BarCode ya existe" });
    }
  }

  const sql =
    "INSERT INTO Products (Name, Description, Code, BarCode, OriginProductId, LocationId, ModifyDate, Deleted) VALUES (?, ?, ?, ?, ?, ?, DATE(), FALSE) RETURNING id";

  const sqlStock =
    "INSERT INTO StockProducts (Quantity, ProductId) VALUES (?, ?)";

  const sqlImage =
    "INSERT INTO ProductImages (ProductId, ImageId) VALUES (?, ?)";

  const sqlCategories =
    "INSERT INTO CategoriesProducts (IdProduct, IdCategory) VALUES (?, ?)";

  try {
    const {rows: insProductRes} = await database.query(sql, [
      Name,
      Description,
      Code,
      BarCode,
      OriginProductId,
      LocationId,
    ]);

    const idProduct = insProductRes[0].id;

    if ((Images ?? []).length > 0) {
      await Promise.all(
        Images.map(async (image) => {
          await database.query(sqlImage, [idProduct, image]);
        })
      );
    }

    if ((Categories ?? []).length > 0) {
      await Promise.all(
        Categories.map(async (category) => {
          await database.query(sqlCategories, [idProduct, category]);
        })
      );
    }

    await database.query(sqlStock, [0, idProduct]);

    res.json({
      success: true,
    });
  } catch (e) {
    console.error("Error al insertar:", e);
    res
      .status(500)
      .json({ success: false, error: "Error al insertar en la base de datos" });
  } finally {
    database.close();
  }
});

// UPDATE ONE
router.patch("/:id", async (req, res) => {
  const {
    Name = null,
    Description = null,
    Code = null,
    BarCode = null,
    Images = [],
    Categories = [],
    OriginProductId = null,
    LocationId = null,
  } = req.body;

  const database = new DB();

  if (Code) {
    const sql = "SELECT * FROM Products WHERE (Code = ?) AND id <> ? AND Deleted = FALSE";
    const data = await database.query(sql, [Code, req.params.id]);
    if (data.rows[0]) {
      return res
        .status(400)
        .json({ success: false, error: "El Code ya existe" });
    }
  }

  if (BarCode) {
    const sql = "SELECT * FROM Products WHERE (BarCode = ?) AND id <> ? AND Deleted = FALSE";
    const data = await database.query(sql, [BarCode, req.params.id]);
    if (data.rows[0]) {
      return res
        .status(400)
        .json({ success: false, error: "El BarCode ya existe" });
    }
  }

  const sql =
    "UPDATE Products SET Name = IFNULL(?, Name), Description = IFNULL(?, Description), Code = IFNULL(?, Code), BarCode = IFNULL(?, BarCode), OriginProductId = IFNULL(?, OriginProductId), LocationId = IFNULL(?, LocationId), ModifyDate = DATE()() WHERE id = ?";

  const sqlImageInit = "DELETE FROM ProductImages WHERE ProductId = ?";

  const sqlImageFinish =
    "INSERT INTO ProductImages (ProductId, ImageId) VALUES (?, ?)";

  const sqlCategoriesInit =
    "DELETE FROM CategoriesProducts WHERE IdProduct = ?";
    
  const sqlCategoriesFinish =
    "INSERT INTO CategoriesProducts (IdProduct, IdCategory) VALUES (?, ?)";

  try {
    const dbRes = await database.query(sql, [
      Name,
      Description,
      Code,
      BarCode,
      OriginProductId,
      LocationId,
      req.params.id,
    ]);

    if ((Images ?? []).length > 0) {
      await database.query(sqlImageInit, [req.params.id]);
      await Promise.all(
        Images.map(async (image) => {
          await database.query(sqlImageFinish, [req.params.id, image]);
        })
      );
    }

    if ((Categories ?? []).length > 0) {
      await database.query(sqlCategoriesInit, [req.params.id]);
      await Promise.all(
        Categories.map(async (image) => {
          await database.query(sqlCategoriesFinish, [req.params.id, image]);
        })
      );
    }

    res.json({
      success: dbRes.ready,
    });
  } catch (e) {
    console.error("Error al actualizar:", e);
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar la base de datos" });
  } finally {
    database.close();
  }
});

// DELETE ONE
router.delete("/:id", async (req, res) => {
  const database = new DB();

  const sql = "UPDATE Products SET Deleted = TRUE, ModifyDate = DATE() WHERE id = ? AND Deleted = FALSE";
  const sqlStock = "DELETE FROM StockProducts WHERE ProductId = ?";

  try {
    const dbProductRes = await database.query(sql, [req.params.id]);
    const dbStockProductRes = await database.query(sqlStock, [req.params.id]);

    if (dbStockProductRes.ready) {
      res.json({
        success: dbProductRes.ready && dbStockProductRes.ready,
      });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Error al eliminar la base de datos" });
    }
  } catch (e) {
    console.error("Error al eliminar:", e);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar la base de datos" });
  } finally {
    database.close();
  }
});

export default router;
