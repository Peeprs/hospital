const express = require("express");
const User = require("../models/user.cjs");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post("/", async (req, res) => {
  const nuevo = new User(req.body);
  const guardado = await nuevo.save();
  res.status(201).json(guardado);
});

router.put("/:id", async (req, res) => {
  const actualizado = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(actualizado);
});

router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuario eliminado" });
});

module.exports = router;
