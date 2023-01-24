// appelle de fichier besoin pour creer un utilisateur enseignant
const express = require('express');
const router = express.Router();
const User = require("../models/enseignantUserModel");

// appelle de module besoin pour creer/connecter
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// creer || inscription d' utilisateur enseignant en verifiant si cette utilisateur existe ou pas
// avec la gestion  de message  si l'utilisateur existe déjà
router.post("/register", async (req, res) => {
    try {
        const searchUser = await User.findOne({ email: req.body.email });
        if (searchUser) {
            // console.warn("cette utilisateur existe déjà")
            return res
                .status(403)
                .json({ message: `l'utilisateur(trice) ${searchUser.email} existe déjà`, statuts: 403 });
        }
        // creation du nouveu utilisateur
        const user = new User(req.body);
        const newUser = await user.save();
        console.log("Création réussi");
        return res
            .status(201)
            .json({ message: `Enseignat(e) ${newUser.userName} a été crée.`, statuts: 201 });
    } catch (error) {
        // gestion de d'erreur 500
        return res
            .status(500)
            .json({ message: error.message, statuts: 500 })
    }
});

// connection au compte
router.post("/login", async (req, res) => {
    //dans le body on va retrouver email et pwd 
    //* recuperer le user grace a son email, verifier s'il existe et verifier le mdp
    try {
        const searchUser = await User.findOne({ email: req.body.email });
        if (!searchUser) {
            return res
                .status(400)
                .json({ message: "cette utilisateur(trice) n'existe pas.", statut: 400 })
        }
        const isMatch = await bcrypt.compare(req.body.password, searchUser.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Mot de passe est incorrect.", statut: 401 })
        }
        let payLoad = {
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

// montrer la liste tous les enseignant 
router.get("/", auth, async (req, res) => {
    try {
        const userList = await User.find().sort("userName");
        res.status(200)
            .json({ statut: 200, result: userList })
    } catch (error) {
        res.status(500)
            .json(error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const userOne = await User.findById(req.params.id)
        res.status(200)
            .json({ statut: 200, result: userOne })
    } catch (error) {
        res.status(500)
            .json(error.message);
    }
});

// delete un utilisateur ,en premier on verifie si cette id existe anvant de le suprimer  
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const getUser = await User.findById(req.params.id)
        if (!getUser) {
            return res.status(404).json({
                statut: 404, message: "cet(te) personne n'existe pas"
            });
        }
        await getUser.remove();
        return res
            .status(200)
            .json({ statut: 200, message: "ce utilisateur(trice) a ete suprimer" })
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// faire une modification et faire l'update de l'utilisateur
router.put("/update/:id", auth, async (req, res) => {
    try {
        const updateUser = await User.findById(req.params.id)
        if (!User) {
            return res.status(404).json({
                statut: 404, message: "cet(te) personne n'existe pas"
            });
        }
        await updateUser.updateOne(req.body);
        return res
            .status(200)
            .json({ statut: 200, message: "cet(trice) utilisateur(trice) a ete mis à jour" })
    } catch (error) {
        res.status(500).json(error.message);
    }
});



module.exports = router;