const express = require("express");
const User = require("../models/user.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const nuevoUsuario = new User(req.body);
    const guardado = await nuevoUsuario.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ message: "Error al crear usuario", error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const usuarioActualizado = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar usuario", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const usuarioEliminado = await User.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
});

module.exports = router;
