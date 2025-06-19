const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const { jsonRpcHandler } = require("./rpc/jsonRpcHandler"); 

const app = express();

app.use(express.json());
app.use(cors());

app.post("/jsonrpc", jsonRpcHandler);

app.get("/", (req, res) => {
  res.send("Welcome to the chat API (REST + JSON-RPC)");
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const uri = process.env.DATABASE_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB error:", err.message));