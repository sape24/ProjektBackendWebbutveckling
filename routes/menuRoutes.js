const express = require("express")
const router = express.Router()
const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./db/api.db")
const authenticateToken = require("../Middleware/authMiddleware")

router.get("/", (req, res) =>{
    db.all("SELECT * FROM menu", (err, rows) =>{
        if (err) return res.status(500).json({error: err.message})
        res.json(rows)
    })
})

router.post("/", authenticateToken, (req, res) => {
    const {name, description, price, category} = req.body

    if (!name || !description || !price || !category) {
        return res.status(400).json({error: "Alla fält måste vara ifyllda"})
    }

    const stmt = db.prepare(
        "INSERT INTO menu (name, description, price, category) VALUES (?, ?, ?, ?)"
    )
    stmt.run(name, description, price, category, function (err) {
        if (err) return res.status(500).json ({error: err.message})
        res.status(201).json({id: this.lastID, name, description, price, category})
    })
    stmt.finalize()
})

router.put("/:id", authenticateToken, (req, res) => {
    const {id} = req.params
    const {name, description, price, category} = req.body

    const stmt = db.prepare(
        "UPDATE menu SET name = ?, description = ?, price = ?, category = ? WHERE id = ?"
    )
    stmt.run(name, description, price, category, id, function (err){
        if (err) return res.status(500).json({error: err.message})
        if (this.changes === 0) return res.status(404).json({error: "Rätten hittades inte"})
        res.json({message: "Rätten uppdaterad"})
    })
    stmt.finalize()
})

router.delete("/:id", authenticateToken, (req, res) => {
    const {id} = req.params
    const stmt = db.prepare("DELETE FROM menu WHERE id = ?")
    stmt.run(id, function(err) {
        if (err) return res.status(500).json({error: err.message})
        if (this.changes === 0) return res.status(404).json({error: "Rätten hittades inte"})
        res.json({message: "Rätten togs bort"})
    })
    stmt.finalize()
})

module.exports = router