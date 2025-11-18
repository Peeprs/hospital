const express = require("express");
const User = require("../models/user.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

router.post("/", async (req, res) => {
  try {
    const nuevo = new User(req.body);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const actualizado = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

module.exports = router;
