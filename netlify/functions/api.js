// netlify/functions/api.js
import express from 'express';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar tus rutas CRUD

import router from '../../server/routers/users.js';

// Cargar variables de entorno
// Netlify las proveerá desde su UI, pero esto es para desarrollo local
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- Conexión a MongoDB ---
// Reutilizamos la lógica de conexión aquí
// Nota: process.env.MONGO_URI debe estar en las variables de Netlify
const mongoURI = process.env.MONGO_URI;
let conn = null;

const connectDB = async () => {
  if (conn == null) {
    console.log("Creando nueva conexión a MongoDB...");
    try {
      conn = await mongoose.connect(mongoURI);
      console.log("✅ Conectado a MongoDB");
    } catch (err) {
      console.error("❌ Error al conectar a MongoDB:", err);
      // Salir si no se puede conectar
      process.exit(1); 
    }
  } else {
    console.log("Usando conexión existente de MongoDB.");
  }
  return conn;
};

// --- Rutas ---
// Esta es la clave: le decimos a Express que use nuestras rutas
// bajo el prefijo /api/users
app.use('/api/users', router);

// Ruta base
app.get("/api", (req, res) => {
  res.send("API Serverless funcionando 🏥");
});

// --- Exportar el handler de Netlify ---
// Envolvemos la app de Express con serverless-http
// y nos aseguramos de conectar a la DB antes de manejar la petición
export const handler = async (event, context) => {
  // Asegurar que la conexión a la DB esté activa
  await connectDB(); 
  const result = await serverless(app)(event, context);
  return result;
};