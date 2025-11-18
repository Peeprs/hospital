// netlify/functions/api.js
const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");

// Importar rutas (ahora CJS)
const router = require("../../server/routers/users.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
let conn = null;

const connectDB = async () => {
  if (!conn) {
    try {
      conn = await mongoose.connect(mongoURI);
      console.log("MongoDB conectado");
    } catch (err) {
      console.error("Error al conectar:", err);
      process.exit(1);
    }
  }
  return conn;
};

app.use("/api/users", router);

app.get("/api", (req, res) => {
  res.send("API serverless funcionando");
});

exports.handler = async (event, context) => {
  await connectDB();
  return await serverless(app)(event, context);
};
