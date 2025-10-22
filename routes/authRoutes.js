const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sqlite3 = require("sqlite3").verbose()
const router = express.Router()
const db = new sqlite3.Database("./db/api.db")                //ansluter till sqlite databasen

const SECRET_KEY = process.env.JWT_SECRET_KEY                   //hämtar secret key från .env filen

router.post("/login", (req, res) => {
    const {username, password} = req.body                               //hämtar användarnamn och lösenord från request body

    if (!username || !password){                                           //validerar att båda fälten är ifyllda
        return res.status(400).json({error: "Ange både användarnamn och lösenord"})
    }

    db.get("SELECT * FROM user WHERE username = ?", [username], async (err, user) =>{               //hämat användaren från databasen baserat på användarnamn
        if (err) return res.status(500).json({error: err.message})
        if (!user) return res.status(401).json({error:"Felaktikt användarnamn"})                          //ingen användare hittad
        try{
            const match = await bcrypt.compare(password, user.password)                                          //jänför inskrivet lösenord med hashat lösneord i databasen
        if (!match) return res.status(401).json({error: "Felaktigt användarnamn eller lösenord"})

        const token = jwt.sign({id: user.id, username: user.username}, SECRET_KEY, {expiresIn: "2h"})              //skapar jwt token som innehåller användarens id och användarnamn, token giltigt i 2 timmar
        res.json({ message: "inloggning lyckades", token})
        } catch(error){
            res.status(500).json({error: "Något gick fel vid inloggning"})
        }
        
    })
})

module.exports = router                         //exportar routen så den kan användas i server.js