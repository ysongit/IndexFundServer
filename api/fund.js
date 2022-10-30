const express = require("express");
const router = express.Router();

const db = require("../helper/db");

router.get("/getallfunds", async (req, res) => {
  try {
    const conn = await db();
    const data = await conn.query("SELECT * FROM fund");
    if (conn) {
      await conn.end();
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getallfundsbyuser/:useraddress", async (req, res) => {
  try {
    const useraddress = req.params.useraddress;
    const conn = await db();
    const data = await conn.query(`SELECT * FROM fund WHERE useraddress ='${useraddress}'`);
    if (conn) {
      await conn.end();
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/createfund", async (req, res) => {
  try {
    const useraddress = req.body.useraddress;

    const conn = await db();
    const data = await conn.query(`INSERT INTO fund (useraddress, numberofholders) VALUES ('${useraddress}', 1)`);
    if (conn) {
      await conn.end();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getalltokensbyfund/:fundid", async (req, res) => {
  try {
    const fundid = req.params.fundid;
    const conn = await db();
    const data = await conn.query(`SELECT * FROM token WHERE fundid ='${fundid}'`);
    if (conn) {
      await conn.end();
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/addtokentofund", async (req, res) => {
  try {
    const fundid = req.body.fundid;
    const contractaddress = req.body.contractaddress;
    const amount = req.body.amount;

    const conn = await db();
    const data = await conn.query(`INSERT INTO token (fundid, contractaddress, amount) VALUES ('${fundid}', '${contractaddress}', '${amount}')`);
    if (conn) {
      await conn.end();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;