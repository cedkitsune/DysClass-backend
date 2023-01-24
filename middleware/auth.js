const jwt = require ("jsonwebtoken")

const auth = (req,res,next)=>{
    try{
        // extraire le token du header"Authorization
        const token = req.headers.authorization.split(" ")[1];
        //on verifie la validité du token
        jwt.verify(token, process.env.PRIVATE_KEY, (err, payload)=> {
            if(err){
                return res
                .status(401)
                .json({statut:401, message:"vous devez etre connecté"})
            }
            req.payload = payload;
            next();
        })
    } catch(error) {
        res.status (500).json(error.message);
    }
};
module.exports = auth;