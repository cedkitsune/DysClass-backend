// ---appelle des dépendances besoin 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());

// configuration pour dotenv
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log("La connexion à la BDD a été établie."))
    .catch((error) => console.log(error))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// creation des noms pour les routes pour get, post, delete et update 
const classeRoute = require("./routes/classeRoute")
app.use("/classe", classeRoute);

const eleveRoute = require("./routes/eleveRoute")
app.use("/eleve", eleveRoute);

const enseignantRoute = require("./routes/enseignantRoute")
app.use("/enseignant", enseignantRoute);

// const exerciceRoute = require("./routes/exerciceRouter")
// app.use("/exercice", exerciceRoute);

// configuration du port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Le serveur est à l'écoute sur le port ${PORT}`));