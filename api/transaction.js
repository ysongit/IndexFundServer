const express = require("express");
const router = express.Router();

const db = require("../helper/db");

router.get("/getalltransactions", async (req, res) => {
  try {
    const conn = await db();
    const data = await conn.query("SELECT * FROM transactions");
    if (conn) {
      await conn.end();
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getrecenttransactions/:useraddress", async (req, res) => {
  try {
    const useraddress = req.params.useraddress;

    const conn = await db();
    const data = await conn.query(`SELECT * FROM transactions WHERE useraddress = '${useraddress}' LIMIT 3`);
    if (conn) {
      await conn.end();
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/addtransaction", async (req, res) => {
  try {
    const useraddress = req.body.useraddress;
    const nameoffund = req.body.nameoffund;
    const typeoftransaction = req.body.typeoftransaction;
    const amount = req.body.amount;
    const price = req.body.price;

    const conn = await db();
    const isSucess = await conn.query(`INSERT INTO transactions (useraddress, nameoffund, typeoftransaction, amount, price) VALUES ('${useraddress}', '${nameoffund}', '${typeoftransaction}', '${amount}', '${price}')`);

    if (conn) {
      await conn.end();
    }

    res.json(isSucess[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;