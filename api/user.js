const express = require("express");
const fetch = require("node-fetch");
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
    let userData = [];
    let total = 0;
    let tokens = [];

    const conn = await db();
    userData = await conn.query(`SELECT * FROM user WHERE address ='${address}'`);
    if (userData.length === 0) {
      await conn.query(`INSERT INTO user (address, amount) VALUES ('${address}', 0)`);
      userData = await conn.query(`SELECT * FROM user WHERE address ='${address}'`);
    }
    else {
      const userfund = await conn.query(`SELECT * FROM fund WHERE useraddress ='${address}'`);

      for(let u of userfund[0]){
        const indexfund = await conn.query(`SELECT * FROM token WHERE fundid ='${u.id}'`);
        const newData = [];

        for(let d of indexfund[0]){
          const data = await fetch(`https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${d.contractaddress}/?quote-currency=USD&format=JSON&key=${process.env.COVALENT_API}`);
          const prices = await data.json();
          d.price = prices.data[0].prices[0].price;
          d.tokenname = prices.data[0].contract_name;
          d.total = prices.data[0].prices[0].price * d.amount;
          total += prices.data[0].prices[0].price * d.amount;
          newData.push(d);
        }

        tokens.push(newData);
      }
    }

    if (conn) {
      await conn.end();
    }

    res.json({ userData: userData[0], total, tokens });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;