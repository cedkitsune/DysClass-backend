const express = require('express');
const router = express.Router();
const UserEleve = require("../models/eleveUserModel");

// appelle de module besoin pour creer/connecter
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// creer un elevee 
router.post("/register", auth, async (req, res) => {
    try {
        const searchEleve = await UserEleve.findOne({ userName: req.body.userName });
        if (searchEleve) {
            // console.warn("cette utilisateur(trice) existe déjà")
            return res
                .status(403)
                .json({ message: `l'élèves(es) ${searchEleve.userName} existe déjà`, statuts: 403 });
        }
        // creation du nouveu utilisateur
        const userEleve = new UserEleve(req.body);
        const newUserEleve = await userEleve.save();
        console.log("Création réussi");
        return res
            .status(201)
            .json({ message: `l'éleve(e) ${newUserEleve.userName} a été crée.`, statuts: 201 });
    } catch (error) {
        // gestion de d'erreur 500
        return res
            .status(500)
            .json({ message: error.message, statuts: 500 })
    }
});

//connection au compte
router.post("/login", async (req, res) => {
    //dans le body on va retrouver email et pwd 
    //* recuperer le user grace a son email, verifier s'il existe et verifier le mdp
    try {
        const searchUser = await User.findOne({ email: req.body.email });
        if (!searchUser) {
            return res
                .status(400)
                .json({ message: "cette utilisateur n'existe pas.", statut: 400 })
        }

        const isMatch = await bcrypt.compare(req.body.password, searchUser.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Mot de passe est incorrect.", statut: 401 })
        }
        const payLoad = {
            id: searchUser.id,
            login: searchUser.id,
            email: searchUser.email,
            password: searchUser.password,
            isAdmin: searchUser.isAdmin
        }
        const token = jwt.sign(payLoad, process.env.PRIVATE_KEY, { expiresIn: '1hours' });
        return res
            .status(200)
            .json({
                message: {
                    token: token,
                    user: {
                        userName: searchUser.userName,
                        email: searchUser.email,
                        password: searchUser.password,
                        isAdmin: searchUser.isAdmin
                    }
                }
            })
    } catch (error) {
        return res
            .status(500)
            .json({ message: "error.message" })
    }
});

router.get("/:id", auth, async (req, res) =>{
    try {
        const serachEleve = await Class.find({teacher:req.params.teacher})
    console.log();
    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.get("/", auth, async (req, res) => {
    try {
        const searchEleve = await UserEleve.find(req.params.id)
        res.status(200)
            .json({ statut: 200, result: searchEleve })

        console.log(searchEleve);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

// effacer un user eleve 
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const getEleve = await UserEleve.findById(req.params.id)
        if (!getEleve) {
            return res.status(404).json({
                statut: 404, message: "cet(te) élève(e) n'existe pas"
            });
        }
        await getEleve.remove();
        return res
            .status(200)
            .json({ statut: 200, message: "cet(te) élève (e ) a ete suprimer" })
    } catch (error) {
        res.status(500).json(error.message);
    }
});

router.put("/update/:id", auth, async (req, res) => {
    try {
        const updateEleve = await UserEleve.findById(req.params.id)
        if (!updateEleve) {
            return res.status(404).json({
                statut: 404, message: "cet(te) personne n'existe pas"
            });
        }
        await updateEleve.updateOne(req.body);
        return res
            .status(200)
            .json({ statut: 200, message: "cet(te) utilisateur(trice) a ete mis à jour" })
    } catch (error) {
        res.status(500).json(error.message);
    }
});

module.exports = router;