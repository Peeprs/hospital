// netlify/functions/api.cjs
const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");

const router = require("../../server/routers/users.cjs");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mongo
const mongoURI = process.env.MONGO_URI;
let conn = null;

async function connectDB() {
  if (!conn) {
    conn = await mongoose.connect(mongoURI);
    console.log("MongoDB conectado");
  }
  return conn;
}

app.use("/api/users", router);

app.get("/api", (req, res) => {
  res.send("API funcionando");
});

module.exports.handler = async (event, context) => {
  await connectDB();
  return await serverless(app)(event, context);
};
