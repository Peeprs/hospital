// El trabajo principal de esta clase es aseguraarse de que todo este listo para la llegada
// de solicitudes del cliente y que lo redireccione correctamente

// Funciones principales que reune todas las herramientas necesarias
const express = require("express");  // Framework que ayuda entender los datos del cliente
const mongoose = require("mongoose"); // Se encarga de asegurarse que la base de datos esté lista
const serverless = require("serverless-http"); // Se encarga envolver la aplicacion para que pueda ser usada en netlify
const cors = require("cors"); // Dar permisos de seguridad, permite al front acceder al back. Sin esto no funcionaria
const dotenv = require("dotenv"); // Lee las variables como direcciones de la base de datos desde un archivo oculto


// Rutas para traer la logica de los usuarios
const router = require("../../server/routers/users.js");

// Carga las variables del archivo .env
dotenv.config();

// Configura el servidor
const app = express();
app.use(cors()); // Habilita permisos de seguridad
app.use(express.json()); // Lee el JSON que envia el cliente y los entiende

// Configura la base de datos
const mongoURI = process.env.MONGO_URI;
let conn = null; // Se usa para que no hayas varias conecciones a la base de datos

// Funcion que se encarga de conectar a la base de datos
async function connectDB() {
  if (!conn) {
    try {
      conn = await mongoose.connect(mongoURI);
      console.log("MongoDB conectado");
    } catch (error){
      console.error("Error conectando a MongoDB (Rejected):", error);

      conn = null;
      throw error;
    }
  }
  return conn; // Devuelve la coneccion a la base de datos
}

app.use("/api/users", router); // Todo lo que llegue a /api/users se dirige a router


// Verifica que la API esta funcionando
app.get("/api", (req, res) => {
  res.send("API funcionando");
});

// Exporta la llamada a la API para pasarla a netlify y devuelva la respuesta
module.exports.handler = async (event, context) => {
  await connectDB();
  return await serverless(app)(event, context);
};
