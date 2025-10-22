const express = require("express")
const router = express.Router()
const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./db/api.db")                                      //ansluter till sqlite databasen
const authenticateToken = require("../Middleware/authMiddleware")               //improterar middleware för jwt verifiering

router.get("/", (req, res) =>{
    db.all("SELECT * FROM menu", (err, rows) =>{                               //hämtar alla rätter från tabellen menu
        if (err) return res.status(500).json({error: err.message})               
        res.json(rows)                                                         //skickar tillbaka resultatet som json
    })
})

router.post("/", authenticateToken, (req, res) => {
    const {name, description, price, category} = req.body                    //hämtar fält från request body

    if (!name || !description || !price || !category) {              //enkel validering av inputdatan
        return res.status(400).json({error: "Alla fält måste vara ifyllda"})
    }

    const stmt = db.prepare(                                                           //förbereder sql sats för att lägga till ny rätt
        "INSERT INTO menu (name, description, price, category) VALUES (?, ?, ?, ?)"
    )
    stmt.run(name, description, price, category, function (err) {                        //kör sql sats med inmatada värden
        if (err) return res.status(500).json ({error: err.message})
        res.status(201).json({id: this.lastID, name, description, price, category})
    })
    stmt.finalize()                     //stänger statement efter körning
})

router.put("/:id", authenticateToken, (req, res) => {
    const {id} = req.params                                             //hämtar id från url
    const {name, description, price, category} = req.body                  //hämtar nya värden

    const stmt = db.prepare(                                                                //förbereder sql sats för uppdatering
        "UPDATE menu SET name = ?, description = ?, price = ?, category = ? WHERE id = ?"
    )
    stmt.run(name, description, price, category, id, function (err){
        if (err) return res.status(500).json({error: err.message})
        if (this.changes === 0) return res.status(404).json({error: "Rätten hittades inte"})       //om inget uppdaterades
        res.json({message: "Rätten uppdaterad"})
    })
    stmt.finalize()
})

router.delete("/:id", authenticateToken, (req, res) => {
    const {id} = req.params                                                         //hämtar id från url
    const stmt = db.prepare("DELETE FROM menu WHERE id = ?")                         //förbereder sql delete sats
    stmt.run(id, function(err) {
        if (err) return res.status(500).json({error: err.message})
        if (this.changes === 0) return res.status(404).json({error: "Rätten hittades inte"})        //om inget togs bort
        res.json({message: "Rätten togs bort"})
    })
    stmt.finalize()
})

module.exports = router                                                             //exporterar routen så den kan användas i server.js