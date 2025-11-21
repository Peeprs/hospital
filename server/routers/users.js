// Usa el formulario de la API para manejar los datos

// Lo que hace cada una es lo siguiente:
// GET: Quieres el archivo y te lo envio
// POST: Esos son los datos? Rellena el formulario
// DELETE: Ese quieres eliminar, dejalo buscarlo y eliminarlo

const express = require("express"); // Crea las rutas
const User = require("../models/user.js"); // Crea el modelo usando las reglas de user.js

const router = express.Router(); // Crea una pequeña ventanilla para que el cliente pueda acceder sin cargar todo el servidor

router.get("/", async (req, res) => { // Oye quiere que leas todos los usuarios
  try {
    const users = await User.find(); // Buscando todos los usuarios
    res.json(users); // Devuelve todos los usuarios en formato JSON
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" }); // Devuelve un error
  }
});

router.post("/", async (req, res) => { // Oye quieres que guarde un nuevo usuario
  try {
    const nuevo = new User(req.body); // Crea un nuevo usuario con los datos recibidos del formulario
    const guardado = await nuevo.save(); // Guarda el usuario en la base de datos
    res.status(201).json(guardado); // Creado correctamente
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario" }); // Error al crear usuario
  }
});

router.put("/:id", async (req, res) => { // Oye quieres que actualice un usuario
  try {
    const actualizado = await User.findByIdAndUpdate( // Buscare al usuario que me pides
      req.params.id, // Ten el ID
      req.body, // Y actualiza los datos
      { new: true } // Para devolver el usuario actualizado
    );
    res.json(actualizado); // Devuelve el usuario actualizado
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" }); // Error al actualizar usuario
  }
});

router.delete("/:id", async (req, res) => { // Oye quieres que elimine un usuario
  try {
    await User.findByIdAndDelete(req.params.id); // Buscare al usuario que me pides
    res.json({ message: "Usuario eliminado" }); // Devuelve el usuario eliminado
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" }); // Error al eliminar usuario
  }
});

module.exports = router;
