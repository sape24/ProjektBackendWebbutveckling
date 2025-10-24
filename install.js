const sqlite3 = require("sqlite3").verbose();                                         //importerar sqlite och aktiverar verbose för mer detaljerad felinformation
const db = new sqlite3.Database("./db/api.db")                                        //skapar och ansluter till databasen
const bcrypt = require("bcrypt")                                                      //importerar bcrypt för att kunna hasha lösenord


db.serialize(() => {                             //Kör följande databasanrop i rad, skapar tabeller ifall dom inte existerar med definitioner
    
    db.run(`                                             
        CREATE TABLE IF NOT EXISTS user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            date     TEXT DEFAULT (datetime('now'))    
        );
    `)

    db.run(`
        CREATE TABLE IF NOT EXISTS menu(                                                     
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT NOT NULL,
            description TEXT NOT NULL,
            price       REAL NOT NULL,
            category    TEXT NOT NULL      
        );
    `)
    console.log("Databas med tabeller skapad")
    
    db.get("SELECT 1 FROM user WHERE username = ?", ["admin"], (err,row) =>{            //kontrollerar om admin redan finns i tabellen user
        if (err){
            console.error("Fel vid sökning av admin:", err.message)                   
            db.close()
            return                                                                  //return och avbryter om fel uppstår
        }

        if(row) {                                                             //om en rad hittas betyder det att admin existerar
            console.log("Admin finns redan")
            db.close()
            return 
        }

        bcrypt.hash("admin123", 10, (hashErr, hashedpassword) =>{                  //hashar lösenordet med 10 som saltvärde
            if (hashErr) {
                console.error("Fel vid hashning:", hashErr.message)
                db.close()
                return
            }

            db.run(`
                INSERT INTO user (username, password) VALUES (?,?)`,                    //lägger till en ny användare admin i databasen med det hashade lösenordet
                ["admin", hashedpassword],
                (insertErr) =>{                                                         
                if (insertErr) {
                    console.error("Fel vid skapandet av adminkonto:", insertErr.message)
                }else{
                    console.log("admin skapad")
                } 
                db.close()                                                                //stänger databasanslutning när allt är klart
                }
            )
        })
    })
})