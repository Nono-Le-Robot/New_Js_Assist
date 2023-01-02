const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const APIRoutes = require("./routes/api.routes.js");
require("dotenv").config({ path: "./config/.env" });

app.use(cors());

// Utilisation du middleware body-parser pour traiter les données envoyées dans les requêtes HTTP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "1000mb" }));

// Association des routes pour les fichiers avec l'URL "/"
app.use("/", APIRoutes);

// Démarrage de l'application sur le port défini dans l'environnement (process.env.PORT)
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
