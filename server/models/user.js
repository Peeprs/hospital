const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  genero: { type: String, required: true },
  fechaN: { type: Date, required: true },
  rfc: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
