const express = require("express")                             //importerar express
const cors = require("cors")                                   //importera cors för att tillåta anrop från andra domäner
const sqlite3 = require("sqlite3").verbose()                   //importerar sqlite och aktiverar verbose för mer detaljerad felsökning
require("dotenv").config()                                     //laddar in variabler från .env filen

const app = express()                                          //skapar en express applikation
const port = process.env.PORT || 3000                           //ange port från .env eller standard 3000
const db = new sqlite3.Database("./db/api.db")                    //ansluter till sqlite databasen

app.use(express.json())
app.use(cors())

const menuRoutes = require("./routes/menuRoutes")                  //crud routes för meny
const authRoutes = require("./routes/authRoutes")                    //routes för inloggning och autentisering
app.use("/api/menu", menuRoutes)                                    //alla anrop till api/menu hanteras av menuroutes
app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})