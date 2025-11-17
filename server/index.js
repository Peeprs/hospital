import express from 'express';
import mongoose from 'mongoose';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';

// Importa TUS rutas que acabamos de corregir
import userRoutes from '../../server/routers/users.js'; // Ajusta la ruta si es necesario

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- Conexión a MongoDB ---
const mongoURI = process.env.MONGO_URI;

// Evitar múltiples conexiones en el entorno serverless
let conn = null;
const connectDB = async () => {
  if (conn == null) {
    console.log("Creando nueva conexión a MongoDB...");
    conn = await mongoose.connect(mongoURI);
    console.log("✅ Conectado a MongoDB");
  } else {
    console.log("Usando conexión existente.");
  }
  return conn;
};

// --- Rutas ---
// Aquí le decimos a Express que use tus rutas
// bajo el prefijo /api/users
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get("/api", (req, res) => {
  res.send("API Serverless del Hospital funcionando 🏥");
});

// --- Exportar el handler de Netlify ---
// Envolvemos la app de Express con serverless-http
export const handler = async (event, context) => {
  await connectDB(); // Asegura la conexión antes de cada petición
  const result = await serverless(app)(event, context);
  return result;
};