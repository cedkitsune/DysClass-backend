// ---  j'appele les modules besoin ---
const mongoose = require("mongoose");

// --- definir le model via le schema
const classeSchema = new mongoose.Schema({

    className: {
        type: String,
        require: true,
    },
    
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "enseignantUserModel"
    }
},
    // --- creation d'un horodatage pour la creation et la mise a jour de la classe
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Classe", classeSchema);