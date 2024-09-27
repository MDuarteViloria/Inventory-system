import express from "express";
import DB from "../database/connect-db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    // Consulta SQL para obtener los datos de la tabla 'Products'
    const sql = "SELECT * FROM Products";
    const database = new DB();

    try {        
        const data = await database.query(sql);
        res.json(data.rows);
    } catch (e) {
        console.error("Error al consultar:", e);
        res.status(404).send("Error al consultar la base de datos");
    } finally {
        
        database.close();
    }
});

export default router; 
