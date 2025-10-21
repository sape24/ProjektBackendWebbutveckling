const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/api.db")
const bcrypt = require("bcrypt")


db.serialize( async() => {                             //Kör följande databasanrop i rad, först en DROP för att ta bort tabellerna om de redan existerar sedan skapar den tabellen med definitioner
    db.run("DROP TABLE IF EXISTS user;")
    db.run("DROP TABLE IF EXISTS menu;")
    
    db.run(`
        CREATE TABLE user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            date     TEXT DEFAULT (datetime('now'))    
        );
    `)

    db.run(`
        CREATE TABLE menu(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            description TEXT NOT NULL,
            price       REAL NOT NULL,
            category    TEXT NOT NULL      
        );
    `)
    console.log("Databas med tabeller skapad")
    try{
        const hashedPassword = await bcrypt.hash("admin123", 10)
        db.run("INSERT INTO user (username, password) VALUES (?, ?)", ["admin", hashedPassword], (err) =>{
        if (err) console.error("Fel vid skapandet av ADMINkonto", err.message)
        else console.log("ADMIN skapat")
    })    
    } catch (error){
        console.error("fel vid hashning")
        db.close();
    }
})