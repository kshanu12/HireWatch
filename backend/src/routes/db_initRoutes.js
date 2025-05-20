const express = require("express");
const router = express.Router();
const db = require("../../config/database");

router.post("/", async (req, res) => {
  try {
    let query = req.body.query;
    let [results] = await db.query(query);
    res.status(200).json({ results });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

module.exports = router;
