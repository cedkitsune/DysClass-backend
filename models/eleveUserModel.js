// ---  j'appele les modules besoin ---
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// --- definir le model via le schema
const userEleveSchema = new mongoose.Schema({

    userName: {
        type: String,
        require: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "classeModel"
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "enseignantUserModel"
    },
    password: {
        type: String,
        require: true
    },
},
    // --- creation d'un horodatage pour la creation et la mise a jour du compte
    {
        timestamps: true,
    }

);

// ---configuration de bcrypt pour le hashage du mot de passe
userEleveSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
})

module.exports = mongoose.model("UserEleve", userEleveSchema);