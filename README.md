# Hospital User Management System

Este proyecto es una aplicación web para la gestión de usuarios de un hospital. Permite registrar, listar, editar y eliminar usuarios. Está construida con una arquitectura **Serverless** utilizando **Netlify Functions**, **Express**, **MongoDB** y **Vanilla JavaScript** en el frontend.

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [API Endpoints](#api-endpoints)
6. [Frontend](#frontend)

---

## 🏥 Descripción General

La aplicación proporciona una interfaz sencilla para administrar la información de los pacientes o usuarios del hospital. Los datos se persisten en una base de datos MongoDB Atlas. La aplicación backend se ejecuta como una función serverless en Netlify, lo que facilita su despliegue y escalabilidad.

### Funcionalidades Principales
- **Registro de Usuarios**: Formulario para ingresar nombre, correo, teléfono, género, fecha de nacimiento y RFC.
- **Listado de Usuarios**: Tabla dinámica que muestra todos los usuarios registrados.
- **Edición**: Capacidad para actualizar la información de un usuario existente.
- **Eliminación**: Opción para borrar registros de la base de datos.
- **Validaciones**: Validación de campos obligatorios y formatos (RFC, Teléfono) en el frontend.

---

## 🛠 Tecnologías Utilizadas

### Backend
- **Node.js**: Entorno de ejecución.
- **Express**: Framework web para manejar las rutas y controladores.
- **Serverless-http**: Adaptador para ejecutar aplicaciones Express en funciones AWS Lambda (Netlify Functions).
- **Mongoose**: ODM para modelar y gestionar datos en MongoDB.
- **Dotenv**: Manejo de variables de entorno.
- **Cors**: Middleware para permitir peticiones desde diferentes orígenes.

### Frontend
- **HTML5**: Estructura de la página.
- **CSS3 / Bootstrap 5**: Estilos y diseño responsivo.
- **JavaScript (Vanilla)**: Lógica del cliente, validaciones y consumo de la API (Fetch).

### Base de Datos
- **MongoDB Atlas**: Base de datos NoSQL en la nube.

### Despliegue
- **Netlify**: Hosting del frontend y funciones serverless.

---

## 📂 Estructura del Proyecto

```
/
├── .env                  # Variables de entorno (MONGO_URI)
├── netlify.toml          # Configuración de despliegue de Netlify
├── package.json          # Dependencias y scripts del proyecto
├── public/               # Archivos estáticos del frontend
│   └── index.html        # Interfaz de usuario principal
├── server/               # Código fuente del backend
│   ├── models/           # Modelos de Mongoose
│   │   └── user.js       # Esquema de Usuario
│   └── routers/          # Rutas de Express
│       └── users.js      # Endpoints CRUD para usuarios
└── netlify/              # Configuración específica de Netlify
    └── functions/        # Funciones Serverless
        └── api.js        # Punto de entrada de la API (Express app wrapper)
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js instalado.
- Una cuenta en MongoDB Atlas y una cadena de conexión (URI).
- Netlify CLI (opcional, para pruebas locales).

### Pasos

1.  **Clonar el repositorio** (si aplica) o descargar los archivos.
2.  **Instalar dependencias**:
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno**:
    Crea un archivo `.env` en la raíz del proyecto y agrega tu cadena de conexión de MongoDB:
    ```env
    MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/hospital
    ```
4.  **Ejecutar localmente**:
    Si tienes `netlify-cli` instalado:
    ```bash
    netlify dev
    ```
    O si deseas ejecutar solo el servidor (requiere ajustar `api.js` para escuchar en un puerto localmente, ya que está configurado para serverless):
    *Nota: El código actual está optimizado para serverless. Para correrlo como un servidor Express tradicional localmente, necesitarías un script adicional que haga `app.listen()`.*

---

## 📡 API Endpoints

La API base se encuentra en `/.netlify/functions/api` (o `/api` si hay reescritura en `netlify.toml`).

| Método | Endpoint      | Descripción                          | Cuerpo (JSON) |
| :----- | :------------ | :----------------------------------- | :------------ |
| GET    | `/api/users`  | Obtener todos los usuarios           | N/A           |
| POST   | `/api/users`  | Crear un nuevo usuario               | `{ name, email, telefono, genero, fechaN, rfc }` |
| PUT    | `/api/users/:id` | Actualizar un usuario por ID      | `{ name, email, ... }` |
| DELETE | `/api/users/:id` | Eliminar un usuario por ID        | N/A           |

### Modelo de Datos (User)
```javascript
{
  name: String,      // Requerido
  email: String,     // Requerido, Único
  telefono: String,  // Requerido
  genero: String,    // Requerido
  fechaN: Date,      // Requerido
  rfc: String        // Requerido
}
```

---

## 🖥 Frontend

El frontend se encuentra en `public/index.html`. Es una Single Page Application (SPA) simple.

- **Formulario**: Utiliza `id="registroForm"` para capturar datos.
- **Tabla**: Utiliza `id="tablaResultados"` para renderizar los usuarios.
- **Lógica**:
    - `cargarUsuarios()`: Fetch GET a la API.
    - `form.addEventListener('submit')`: Maneja POST (crear) y PUT (editar).
    - `eliminar(id)`: Fetch DELETE.
    - `editar(id, user)`: Rellena el formulario con los datos del usuario seleccionado y cambia el modo a edición.

---

## ⏳ Uso de Async/Await

En este proyecto se utiliza **Async/Await** extensivamente tanto en el backend como en el frontend. Aquí te explicamos por qué:

### ¿Por qué lo usamos?
JavaScript es un lenguaje **no bloqueante**. Esto significa que operaciones que toman tiempo (como consultar la base de datos o pedir datos a una API) no detienen la ejecución del resto del código.

Sin `async/await`, tendríamos que usar "Callbacks" o cadenas de `.then()`, lo que hace el código difícil de leer y mantener.

### En este proyecto:

1.  **Backend (Node.js + Mongoose)**:
    Las operaciones con la base de datos (`User.find()`, `nuevo.save()`) son asíncronas.
    *   Usamos `await` para "esperar" a que MongoDB nos devuelva los datos antes de enviarlos al cliente con `res.json()`.
    *   Si no usáramos `await`, `res.json()` se ejecutaría antes de tener los datos, enviando una respuesta vacía o un error.

    ```javascript
    // Ejemplo en routers/users.js
    router.get("/", async (req, res) => {
      // Esperamos a que la BD responda
      const users = await User.find(); 
      // Solo entonces enviamos la respuesta
      res.json(users); 
    });
    ```

2.  **Frontend (Fetch API)**:
    Las peticiones al servidor (`fetch`) dependen de la red y toman tiempo.
    *   Usamos `await fetch(...)` para esperar la respuesta del servidor.
    *   Usamos `await res.json()` para esperar a que el cuerpo de la respuesta se convierta en un objeto JavaScript utilizable.

    ```javascript
    // Ejemplo en index.html
    async function cargarUsuarios() {
      // Esperamos que el servidor conteste
      const res = await fetch(API_URL);
      // Esperamos a procesar el JSON
      const usuarios = await res.json();
      mostrarTabla(usuarios);
    }
    ```

**Beneficio Principal**: El código asíncrono se lee y se comporta como si fuera síncrono (secuencial), lo que facilita la lógica y el manejo de errores con `try/catch`.
