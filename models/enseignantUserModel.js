// ---  j'appele les modules besoin ---
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// --- definir le model via le schema
const userEnseignantSchema = new mongoose.Schema({

        userName:{
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
    },
    // --- creation d'un horodatage pour la creation et la mise a jour du compte
    {
        timestamps: true,
    }
);

// ---configuration de bcrypt pour le hashage du mot de passe
userEnseignantSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

module.exports = mongoose.model("UserEnseignant", userEnseignantSchema);