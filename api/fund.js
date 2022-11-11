require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const db = require("../helper/db");
const formatDate = require("../helper/formatDate");

router.get("/getallfunds", async (req, res) => {
  try {
    const conn = await db();
    const funds = await conn.query("SELECT * FROM fund");
    const newData = [];

    let past5days = new Date();
    past5days.setDate(past5days.getDate() - 5);
    past5days = formatDate(past5days);

    for(let f of funds[0]){
      const data = await conn.query(`SELECT * FROM token WHERE fundid ='${f.id}'`);
      const newTokens = [];
      for(let d of data[0]){
        const data = await fetch(`https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${d.contractaddress}/?quote-currency=USD&format=JSON&from=${past5days}&key=${process.env.COVALENT_API}`);
        const prices = await data.json();
        d.price = prices.data[0].prices[0].price;
        d.url = prices.data[0].logo_url;
        d.tokenname = prices.data[0].contract_name;
        d.total = prices.data[0].prices[0].price * d.amount;
        d.dates =  prices.data[0].prices;
        newTokens.push(d);
      }
      f.tokens = newTokens;
      newData.push(f);
    }
    if (conn) {
      await conn.end();
    }
    res.json(newData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getfundbyid/:fundid", async (req, res) => {
  try {
    const fundid = req.params.fundid;
    const conn = await db();
    const data = await conn.query(`SELECT * FROM fund WHERE id ='${fundid}'`);
    if (conn) {
      await conn.end();
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getfundrecent/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const conn = await db();
    const data = await conn.query(`SELECT * FROM fund WHERE useraddress ='${address}' ORDER BY createdate DESC`);
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
    const tokenname = req.body.tokenname;
    const contractaddress = req.body.contractaddress;

    const conn = await db();
    const data = await conn.query(`INSERT INTO fund (useraddress, contractaddress, tokenname) VALUES ('${useraddress}', '${contractaddress}','${tokenname}')`);
    if (conn) {
      await conn.end();
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/totalbalance/:useraddress", async (req, res) => {
  try {
    const useraddress = req.params.useraddress;
    const conn = await db();
    const userfund = await conn.query(`SELECT * FROM fund WHERE useraddress ='${useraddress}'`);
    let total = 0;

    for(let u of userfund[0]){
      const indexfund = await conn.query(`SELECT * FROM token WHERE fundid ='${u.id}'`);
      
      for(let d of indexfund[0]){
        const data = await fetch(`https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${d.contractaddress}/?quote-currency=USD&format=JSON&key=${process.env.COVALENT_API}`);
        const prices = await data.json();
        total = prices.data[0].prices[0].price * d.amount;
      }
    }
    if (conn) {
      await conn.end();
    }

    res.json(total);
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
    const newData = [];
    
    for(let d of data[0]){
      const data = await fetch(`https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${d.contractaddress}/?quote-currency=USD&format=JSON&key=${process.env.COVALENT_API}`);
      const prices = await data.json();
      d.price = prices.data[0].prices[0].price;
      d.tokenname = prices.data[0].contract_name;
      d.total = prices.data[0].prices[0].price * d.amount;
      console.log("d", d);
      newData.push(d);
    }

    res.json(newData);
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

router.get("/getprice/:contractaddress", async (req, res) => {
  try {  
    const contractaddress = req.params.contractaddress;
  
    const data = await fetch(`https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${contractaddress}/?quote-currency=USD&format=JSON&key=${process.env.COVALENT_API}`);
    const prices = await data.json();

    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;