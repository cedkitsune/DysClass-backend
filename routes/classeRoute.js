const express = require('express');
const router = express.Router();
//appelle de auth(middleware) pour pourvoir faire le CRUD
const Class = require("../models/classeModel");
const auth = require("../middleware/auth");

// créer une classe
router.post("/creat", auth, async (req, res) => {
    try {
        const classe = new Class(req.body);
        const newClass = await classe.save();
        res.status(201)
            .json({ statut: 201, message: "votre classe a étè crée", classe: newClass })
    }
    catch (error) {
        res.status(500).json(error.message)
    }
});
// visualiser tout les classe d'un enseignant
router.get("/", auth, async (req, res) => {
    try {
        const searchClass = await Class.find(req.params.id)
        res.status(200)
            .json({ statut: 200, result: searchClass })

        console.log(searchClass);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

// effacer un classe
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const getClass = await Class.findById(req.params.id)
        if (!getClass) {
            return res.status(404).json({
                statut: 404, message: "cette classe n'existe pas"
            });
        }
        await getClass.remove();
        return res
            .status(200)
            .json({ statut: 200, message: "votre classe a ete suprimer" })
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// faire une modification et faire l'update de l'utilisateur
router.put("/update/:id", auth, async (req, res) => {
    try {
        const updatClass = await Class.findById(req.params.id)
        if (!updatClass) {
            return res.status(404).json({
                statut: 404, message: "cette classe n'existe pas"
            });
        }
        await updatClass.updateOne(req.body);
        return res
            .status(200)
            .json({ statut: 200, message: "Votre classe a ete mis à jour" })
    } catch (error) {
        res.status(500).json(error.message);
    }
});
module.exports = router;