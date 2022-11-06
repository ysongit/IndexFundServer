const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

const user = require("./api/user");
const fund = require("./api/fund");
const transaction = require("./api/transaction");

app.use("/user", user);
app.use("/fund", fund);
app.use("/transaction", transaction);
app.get('/', (req, res) => res.send('It Work'));

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 