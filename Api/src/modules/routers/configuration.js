import express from "express";
import fs from "fs";

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  const configData = JSON.parse(
    fs.readFileSync("./src/sources/deskSettings.json", "utf8")
  );
  res.json(configData);
});

router.post("/", async (req, res) => {
  const { lang, theme } = req.body;
  try {
    let configData = JSON.parse(
      fs.readFileSync("./src/sources/deskSettings.json", "utf8")
    );

    if (lang) {
      configData.lang = lang;
    }

    if (theme) {
      configData.theme = theme;
    }

    fs.writeFileSync(
      "./src/sources/deskSettings.json",
      JSON.stringify(configData),
      "utf8"
    );
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.json({ success: false });
  }
});

router.get("/translations", (req, res) => {
  const { lang: translations } = JSON.parse(
    fs.readFileSync("./src/sources/translations/register.json", "utf8")
  );

  res.json(translations.map((trans) => ({ name: trans.lang })));
});

router.get("/translations/:lang", (req, res) => {
  const { lang: translations } = JSON.parse(
    fs.readFileSync("./src/sources/translations/register.json", "utf8")
  );
  const fileLocation = translations.find(
    (trans) => trans.lang === req.params.lang
  )?.file;

  try {
    const translationData = JSON.parse(
      fs.readFileSync("./src/sources/translations/" + fileLocation, "utf8")
    );
    res.json(translationData);
  } catch (e) {
    res.json({ error: "No existe la traduccion" });
    console.log("Something went wrong: ", e);
  }
});

export default router;
