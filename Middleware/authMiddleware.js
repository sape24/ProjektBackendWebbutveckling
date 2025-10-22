const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.JWT_SECRET_KEY             //hämtar nyckel från .env för verifiering

//middleware funktion som verifierar JWT token
function authenticateToken(req,res, next) {
    const authHeader = req.headers["authorization"]           //hämtar authorization header 
    const token = authHeader && authHeader.split(" ")[1]                //tar bort "bearer" och hämtar självaste token string

    if (!token) return res.status(401).json({error: "Ingen token hittades åtkomst nekad"}) //finns ingen token så nekas åtkomst
    
    jwt.verify(token, SECRET_KEY, (err, user) =>{          //verifierar token med hjälp av secret key
        if (err) return res.status(403).json({ error: "Ogiltig eller gammal token"})  //om token är ogiltig
        req.user = user                                           //lagrar användardatan i request objektet
    next()
    })
}

module.exports = authenticateToken                               //exporterar funktionen för användning i routes