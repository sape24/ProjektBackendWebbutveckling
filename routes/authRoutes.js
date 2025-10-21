const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sqlite3 = require("sqlite3").verbose()
const router = express.Router()
const db = new sqlite3.Database("./db/api.db")

const SECRET_KEY = process.env.JWT_SECRET_KEY

router.post("/login", (req, res) => {
    const {username, password} = req.body

    if (!username || !password){
        return res.status(400).json({error: "Ange både användarnamn och lösenord"})
    }

    db.get("SELECT * FROM user WHERE username = ?", [username], async (err, user) =>{
        if (err) return res.status(500).json({error: err.message})
        if (!user) return res.status(401).json({error:"Felaktikt användarnamn"})
        try{
            const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(401).json({error: "Felaktigt användarnamn eller lösenord"})

        const token = jwt.sign({id: user.id, username: user.username}, SECRET_KEY, {expiresIn: "2h"})
        res.json({ message: "inloggning lyckades", token})
        } catch(error){
            res.status(500).json({error: "Något gick fel vid inloggning"})
        }
        
    })
})

module.exports = router