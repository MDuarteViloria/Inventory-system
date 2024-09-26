import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World!"); // JSON | END | ETC
}, ()=>{ });

export default router;