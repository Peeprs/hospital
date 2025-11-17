import express from "express";
import User from "../models/user.js"; // Asegúrate que la 'U' sea minúscula como tu archivo

const router = express.Router();

// 1. READ (GET) - Obtener todos los usuarios
router.get('/', async (req, res) => { // <-- CORREGIDO (era requestAnimationFrame)
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
});

// 2. CREATE (POST) - Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const nuevoUsuario = new User(req.body);
    const guardado = await nuevoUsuario.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ message: "Error al crear usuario", error });
  }
});

// 3. UPDATE (PUT) - Actualizar un usuario por ID
// ¡ESTA ES LA RUTA QUE FALTABA!
router.put('/:id', async (req, res) => {
  try {
    const usuarioActualizado = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // new:true devuelve el doc actualizado
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar usuario", error });
  }
});


// 4. DELETE (DELETE) - Eliminar usuario por ID
router.delete('/:id', async (req, res) => {
  try {
    const usuarioEliminado = await User.findByIdAndDelete(req.params.id); // <-- CORREGIDO
    if (!usuarioEliminado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
});

export default router;