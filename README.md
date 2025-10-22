## Rest-api för projekt
Webbtjänst byggd med Node.js, express, sqlite3, bcrypt och JWT. API't hanterar autentisering och CRUD för restaurangens meny. Skyddade routes kräver giltig JWT token.

## Inlogg till adminkonto

**Användarnamn** | `admin`
**Lösenord**     | `admin123`

## Autentisering

| Metod  | Ändpunkt        | Beskrivning                                                       |
|--------|-----------------|-------------------------------------------------------------------|
| POST   | /api/auth/login | Loggar in administratör och returnerar en JWT Token.              |

## CRUD för meny


| Metod  | Ändpunkt        | Beskrivning                                                       |
|--------|-----------------|-------------------------------------------------------------------|
| Get    | /api/menu       | Hämtar alla rätter från menyn.                                    |
| POST   | /api/menu       | Lägger till ny rätt i menyn, kräver giltig JWT.                   |
| PUT    | /api/menu/:id   | Uppdaterar en rätt, kräver giltig JWT.                            |
| DELETE | /api/menu/:id   | Tar bort en rätt från menyn, kräver giltig JWT.                   |

Exempel på POST:

```json
{
   "name": "Oxfilé",
   "description": "Serveras med rödvinssås och potatisgratäng.",
   "price": "349",
   "category": "Varmrätt"
}
```
## Databasstruktur
user

| ID | username | password | date |

menu

| ID | name | description | price | category |

## Tekniker

**Node.js**
**Express**
**SQLite3**
**bcrypt**
**JWT**
**dotenv**
**CORS**



