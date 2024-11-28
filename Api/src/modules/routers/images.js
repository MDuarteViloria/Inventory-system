import express from "express";
import fs from "fs";
import saveImage from "../controllers/SaveImage.js";
import createMemoryStorage from "../controllers/CreateMemoryStorage.js";
import DB from "../database/connect-db.js";
import imageType from "image-type";
import config from "../../config.js";

const router = express.Router();
const upload = createMemoryStorage();

router.post("/", upload.array("images"), async (req, res) => {
  const db = new DB();

  const resultingIds = await Promise.all(
    req.files?.map(async (file) => {
      // GETTING FILE BUFFER AND FILE NAME
      const fileBuffer = file.buffer;
      const fileName = file.originalname;

      // SAVING THE IMAGE AND CREATING THE ROUTE
      const route = saveImage(fileBuffer, fileName);

      // INSERTING IN DB
      await db.query("INSERT INTO Images (Route) VALUES (?)", [route]);
      const { rows } = await db.query("SELECT id FROM Images WHERE Route = ?", [
        route,
      ]);

      return rows[0]?.id;
    }) ?? []
  );

  const response = resultingIds.map((id) => {
    return {
      id: id,
      url: `${config.backendUrl}/images/${id}`,
    };
  });

  // DB CLOSING
  db.close();

  // RETURING
  return res.json({ success: true, images: response });
});

router.get("/", async (req, res) => {
  const db = new DB();

  const images = await db.query(`SELECT id, Route FROM Images`).then((data) =>
    data.rows.map((row) => ({
      id: row.id,
      url: `${config.backendUrl}/images/${row.id}`,
    }))
  );

  db.close();

  return res.json(images);
});

router.get("/:id", async (req, res) => {
  const db = new DB();
  const id = req.params.id;

  const route = await db
    .query(`SELECT Route FROM Images WHERE id = ?`, [id])
    .then((data) => data.rows[0]?.Route ?? null);

  db.close();

  if (route) {
    const buffer = fs.readFileSync(route);

    res.writeHead(200, {
      "Content-Type": await imageType(buffer).then((t) => t.mime),
      "Content-Length": buffer.length,
    });

    return res.end(buffer);
  } else return res.sendStatus(404);
});

router.delete("/:id", async (req, res) => {
  const db = new DB();
  const id = req.params.id;

  const route = await db
    .query(`SELECT Route FROM Images WHERE id = ?`, [id])
    .then((data) => data.rows[0]?.Route ?? null);

  if (route) {
    fs.unlinkSync(route);

    await db.query("DELETE FROM Images WHERE id = ?", [id]);

    return res.json({ success: true });
  } else return res.sendStatus(404);
});

export default router;
