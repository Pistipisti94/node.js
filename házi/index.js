const express = require('express'); //express létrehozása
const app = express(); //-- http szervert tudunk vele indítani

const bodyParser = require('body-parser'); //bodyParser létrehozása

const cors = require('cors');  //cors létrehozása
app.use(cors());                  //cors használata



app.use(bodyParser.urlencoded({ extended: false })); // bodyParser használata
app.use(bodyParser.json()); // a bodyban mindig próbálja az adatokat json-é alakítani

const mysql = require('mysql'); //mysql létrehozása
const { throws } = require('assert');
const database = mysql.createConnection({ //Database létrehozása
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tagdij' //ezt az adatbázist használtuk órán
}
);
database.connect((err) => { //Csatlakozás megpróbálása
    if (err) throw err; //nem sikerült
    console.log('Connected');//sikerült
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

//Adatbázis lekérdezése
app.get('/teszt', (req, res) => {                   //http://localhost:3000/tagok
    let sqlcommand = 'SELECT * FROM `ugyfel`';   //Lekérdezés parancs tárolás
    database.query(sqlcommand, (err, rows) => {    //Meghívás lekérdezés
        if (err) throw err;  //nem sikerült
        res.send(rows); //Sikerült
    });
    
});

app.get('/teszt/:id', (req, res) => {                                      //http://localhost:3000/tagok/[azon]
    let sqlcommand = `SELECT * FROM ugyfel WHERE azon=${req.params.id}`;   //Lekérdezés azonosító szerint parancs tárolás
    database.query(sqlcommand, (err, rows) => {                           //Meghívás lekérdezés
        if (err) throw err;  //nem sikerült
        res.send(rows); //Sikerült
    });
});

//******************* */
//*******CRUD******** */
//******************* */
//Create
exports.create = (req, res) => {
    const azon = req.body.azon;
    const nev = req.body.nev;
    const szulev = req.body.szulev;
    const irszam = req.body.irszam;
    const orsz = req.body.orsz;
  
    const query = `INSERT INTO ugyfel (azon, nev, szulev, irszam, orsz) VALUES (?, ?, ?, ?, ?);`;
  
    database.query(query, [azon,nev,szulev,irszam,orsz], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Hiba történt a felhasználó létrehozásakor.");
        return;
      }
  
      res.status(200).send("A felhasználó sikeresen létre lett hozva.");
    });
  };
//READ


const connection = mysql.createConnection({
  host: "localhost",
  database: "tagdij",
  user: "root",
  password: "",
});

connection.connect();

exports.read = (req, res) => {
  const id = parseInt(req.query.id);

  const query = `
    SELECT *
    FROM ugyfel
    WHERE id = ?;
  `;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Hiba történt a felhasználó lekérdezésekor.");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("A felhasználó nem található.");
      return;
    }

    res.send(results[0]);
  });
};

//******************* */
//*******CRUD******** */
//******************* */

app.listen(3005, () => {
    console.log('A szerver fut a 3005-s porton'); //localhost:3000
});
// app.listen után nem szabad írni bajos lehet a futása
