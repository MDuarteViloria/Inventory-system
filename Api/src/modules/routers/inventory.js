import express from "express";
import DB from "../database/connect-db.js";
import config from "../../../config.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  const sql =
    "SELECT P.id, SP.Quantity, P.Name, P.Description, P.Code, P.BarCode, P.LocationId, P.OriginProductId FROM Products P INNER JOIN StockProducts SP ON P.id = SP.ProductId WHERE P.Deleted = FALSE";
  const database = new DB();

  try {
    let data = await database.query(sql);

    res.json(data.rows);
  } catch (e) {
    console.error("Error al consultar:", e);
    res.status(404).send("Error al consultar la base de datos");
  } finally {
    database.close();
  }
});

router.get("/entries", async (req, res) => {
  const sql =
    "SELECT id, User, Description, Date FROM EntriesHeaders ORDER BY Date DESC";

  const database = new DB();

  try {
    let data = await database.query(sql);

    data = data.rows.map(async (hdr) => {
      return {
        ...hdr,
        Lines: await database
          .query(
            "SELECT Quantity, Details, ProductId, ProviderId FROM EntriesLines WHERE EntryHeaderId = ?",
            [hdr.id]
          )
          .then((x) => x.rows),
      };
    });

    data = await Promise.all(data);

    data = await Promise.all(
      data.map(async (hdr) => ({
        ...hdr,
        Lines: req.query.withLines
          ? await Promise.all(
              hdr.Lines.map(async (line) => {
                return {
                  Quantity: line.Quantity,
                  Details: line.Details,
                  Provider: await database
                    .query("SELECT id, Doc, Name FROM Providers WHERE id = ?", [
                      line.ProviderId,
                    ])
                    .then((val) => val[0]),
                  Product: await database
                    .query(
                      "SELECT * FROM Products WHERE id = ? AND Deleted = FALSE",
                      [line.ProductId]
                    )
                    .then((val) => val.rows[0])
                    .then(async (product) => {
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
                            .query(
                              "SELECT ImageId FROM ProductImages WHERE ProductId = ?",
                              [product.id]
                            )
                            .then((origin) =>
                              origin?.rows.map((image) => ({
                                Url:
                                  config.backendUrl +
                                  "/images/" +
                                  image.ImageId,
                                id: image.ImageId,
                              }))
                            )) ?? [],
                        OriginProduct:
                          (await database
                            .query(
                              "SELECT id, Name FROM OriginProducts WHERE id = ?",
                              [product.OriginProductId]
                            )
                            .then((origin) => origin?.rows[0])) ?? null,
                        Location:
                          (await database
                            .query(
                              "SELECT id, Name FROM Locations WHERE id = ?",
                              [product.LocationId]
                            )
                            .then((location) => location?.rows[0])) ?? null,
                      };
                    }),
                };
              })
            )
          : undefined,
      }))
    );

    res.json(data);
  } catch (e) {
    console.error("Error al consultar:", e);
    res.status(500).send("Error al consultar la base de datos");
  } finally {
    database.close();
  }
});

router.get("/entries/:id", async (req, res) => {
  const sql =
    "SELECT id, User, Description, Date FROM EntriesHeaders WHERE id = ?";

  const database = new DB();

  try {
    let data = await database.query(sql, [req.params.id]);

    if (!data.rows[0]) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontraron resultados" });
    }

    data = {
      ...data.rows[0],
      Lines: await database
        .query(
          "SELECT Quantity, Details, ProductId, ProviderId FROM EntriesLines WHERE EntryHeaderId = ?",
          [data.rows[0]?.id]
        )
        .then((x) => x.rows),
    };

    data = {
      ...data,
      Lines: await Promise.all(
        data.Lines.map(async (line) => {
          return {
            Quantity: line.Quantity,
            Details: line.Details,
            Provider: await database
              .query("SELECT id, Doc, Name FROM Providers WHERE id = ?", [
                line.ProviderId,
              ])
              .then((val) => val.rows[0]),
            Product: await database
              .query(
                "SELECT * FROM Products WHERE id = ? AND Deleted = FALSE",
                [line.ProductId]
              )
              .then((val) => val.rows[0])
              .then(async (product) => {
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
                      .query(
                        "SELECT ImageId FROM ProductImages WHERE ProductId = ?",
                        [product.id]
                      )
                      .then((origin) =>
                        origin?.rows.map((image) => ({
                          Url: config.backendUrl + "/images/" + image.ImageId,
                          id: image.ImageId,
                        }))
                      )) ?? [],
                  OriginProduct:
                    (await database
                      .query(
                        "SELECT id, Name FROM OriginProducts WHERE id = ?",
                        [product.OriginProductId]
                      )
                      .then((origin) => origin?.rows[0])) ?? null,
                  Location:
                    (await database
                      .query("SELECT id, Name FROM Locations WHERE id = ?", [
                        product.LocationId,
                      ])
                      .then((location) => location?.rows[0])) ?? null,
                };
              }),
          };
        })
      ),
    };

    res.json(data);
  } catch (e) {
    console.error("Error al consultar:", e);
    res.status(500).send("Error al consultar la base de datos");
  } finally {
    database.close();
  }
});

router.post("/entries", async (req, res) => {
  const { Lines, Description, User } = req.body;

  if (!Lines || (!Description && Description !== "") || !User) {
    return res
      .status(400)
      .json({ success: false, error: "Todos los campos son obligatorios" });
  }

  if (!Array.isArray(Lines)) {
    return res
      .status(400)
      .json({ success: false, error: "El campo Lines debe ser un array" });
  }

  if (Lines.length === 0) {
    return res.status(400).json({
      success: false,
      error: "El campo Lines debe tener al menos un elemento",
    });
  }

  let headerId = 0;

  const database = new DB();

  const headerSql =
    "INSERT INTO EntriesHeaders (User, Description, Date) VALUES (?, ?, DATE()) RETURNING id";
  const lineSql =
    "INSERT INTO EntriesLines (EntryHeaderId, ProductId, Details, Quantity, ProviderId) VALUES (?, ?, ?, ?, ?)";
  const updateInventorySql =
    "UPDATE StockProducts SET Quantity = Quantity + ?, ModifyDate = DATE() WHERE ProductId = ?";
  const imagesSql =
    "INSERT INTO EntriesImages (EntryId, ImageId) VALUES (?, ?)";

  try {
    const tError = (e) => {
      throw new Error(e);
    };

    for (let l of Lines) {
      if (!parseInt(l.Quantity)) {
        tError("El campo Quantity es obligatorio");
      } else if (parseInt(l.Quantity) <= 0) {
        tError("La cantidad debe ser mayor a 0");
      } else if (!l.ProductId) {
        tError("El campo ProductId es obligatorio");
      } else if (!l.Details && l.Details !== "") {
        tError("El campo Details es obligatorio");
      } else if (!l.ProviderId) {
        tError("El campo ProviderId es obligatorio");
      }
    }

    await database.query(headerSql, [User, Description]).then((result) => {
      headerId = result.rows[0].id;
    });

    await Promise.all(
      Lines.map(async (line) => {
        await database.query(lineSql, [
          headerId,
          line.ProductId,
          line.Details,
          parseInt(line.Quantity),
          line.ProviderId,
        ]);

        await database.query(updateInventorySql, [
          line.Quantity,
          line.ProductId,
        ]);

        if (line.Images) {
          await Promise.all(
            line.Images?.map(async (image) => {
              await database.query(imagesSql, [headerId, image]);
            }) ?? (await database.query(imagesSql, [headerId, line.Images]))
          );
        }

        return null;
      })
    );

    res.json({ success: true, id: headerId });
  } catch (e) {
    await database.query("DELETE FROM EntriesHeaders WHERE id = ?", [headerId]);
    console.error("Error al consultar:", e);
    res.status(400).send({ error: e.message });
  } finally {
    database.close();
  }
});

router.post("/outputs", async (req, res) => {
  const { Lines, Description, User } = req.body;

  if (!Lines || (!Description && Description !== "") || !User) {
    return res
      .status(400)
      .json({ success: false, error: "Todos los campos son obligatorios" });
  }

  if (!Array.isArray(Lines)) {
    return res
      .status(400)
      .json({ success: false, error: "El campo Lines debe ser un array" });
  }

  if (Lines.length === 0) {
    return res.status(400).json({
      success: false,
      error: "El campo Lines debe tener al menos un elemento",
    });
  }

  let headerId = 0;

  const headerSql =
    "INSERT INTO OutputsHeaders (User, Description, Date) VALUES (?, ?, DATE()) RETURNING id";
  const lineSql =
    "INSERT INTO OutputsLines (OutputHeaderId, ProductId, Details, Quantity) VALUES (?, ?, ?, ?)";
  const updateInventorySql =
    "UPDATE StockProducts SET Quantity = Quantity - ?, ModifyDate = DATE() WHERE ProductId = ?";
  const imagesSql =
    "INSERT INTO OutputsImages (OutputId, ImageId) VALUES (?, ?)";
  const getActualStockSql =
    "SELECT Quantity FROM StockProducts WHERE ProductId = ?";

  const database = new DB();

  try {
    const tError = (e) => {
      throw new Error(e);
    };

    for (let l of Lines) {
      if (!parseInt(l.Quantity)) {
        tError("El campo Quantity es obligatorio");
      } else if (parseInt(l.Quantity) <= 0) {
        tError("La cantidad debe ser mayor a 0");
      } else if (!l.ProductId) {
        tError("El campo ProductId es obligatorio");
      } else if (!l.Details && l.Details !== "") {
        tError("El campo Details es obligatorio");
      } else if (
        !(await Promise.all(
          Lines.map(async (line) => {
            return (
              (await database
                .query(getActualStockSql, [line.ProductId])
                .then((result) => {
                  return (
                    (result.rows[0] && result.rows[0].Quantity >= l.Quantity) ??
                    false
                  );
                })) ?? false
            );
          })
        ).then((allInStock) => allInStock.every((x) => x)))
      ) {
        tError("La cantidad solicitada no esta en stock");
      }
    }

    await database.query(headerSql, [User, Description]).then((result) => {
      headerId = result.rows[0].id;
    });

    await Promise.all(
      Lines.map(async (line) => {
        await database.query(lineSql, [
          headerId,
          line.ProductId,
          line.Details,
          parseInt(line.Quantity),
        ]);

        await database.query(updateInventorySql, [
          line.Quantity,
          line.ProductId,
        ]);

        if (line.Images) {
          await Promise.all(
            line.Images?.map(async (image) => {
              await database.query(imagesSql, [headerId, image]);
            }) ?? (await database.query(imagesSql, [headerId, line.Images]))
          );
        }

        return null;
      })
    );

    res.json({ success: true, id: headerId });
  } catch (e) {
    await database.query("DELETE FROM OutputsHeaders WHERE id = ?", [headerId]);
    console.error("Error al consultar:", e);
    res.status(400).send({ error: e.message });
  } finally {
    database.close();
  }
});

export default router;
