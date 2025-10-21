const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()
require("dotenv").config()

const app = express()
const port = process.env.PORT || 3000
const db = new sqlite3.Database("./db/api.db")

app.use(express.json())
app.use(cors())

const menuRoutes = require("./routes/menuRoutes")
const authRoutes = require("./routes/authRoutes")
app.use("/api/menu", menuRoutes)
app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})