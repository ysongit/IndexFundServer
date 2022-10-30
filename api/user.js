const express = require("express");
const router = express.Router();

const db = require("../helper/db");

router.get("/getallusers", async (req, res) => {
  try {
    const conn = await db();
    const data = await conn.query("SELECT * FROM user");
    if (conn) {
      await conn.end();
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const address = req.body.address;
    let userData;
    const conn = await db();
    userData = await conn.query(`SELECT * FROM user WHERE address ='${address}'`);
    if (userData.length === 0) {
      await conn.query(`INSERT INTO user (address, amount) VALUES ('${address}', 0)`);
      userData = await conn.query(`SELECT * FROM user WHERE address ='${address}'`);
    }
    if (conn) {
      await conn.end();
    }
    res.json(userData[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;