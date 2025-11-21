//  Esta clase solo se encarfa de definir la forma de los datos y sus reglas
// si intentas guardar datos que no cumplen con las reglas, te dara error

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
