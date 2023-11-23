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
    if (err) {
        console.error('Hiba a MySQL kapcsolat során: ' + err.stack);
        return;
      }
      console.log('Sikeres MySQL kapcsolat, ID: ' + database.threadId);
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
app.post('/users', (req, res) => {
    const { username, email } = req.body;
    const INSERT_USER_QUERY = `INSERT INTO users (username, email) VALUES (?, ?)`;
    database.query(INSERT_USER_QUERY, [username, email], (err, result) => {
      if (err) {
        res.status(500).send('Hiba a felhasználó létrehozása során.');
      } else {
        res.status(201).send('Felhasználó létrehozva.');
      }
    });
  });

//READ


app.get('/tagok', (req, res) => {                   //http://localhost:3005/tagok
    let sqlcommand = 'SELECT * FROM `ugyfel`';   //Lekérdezés parancs tárolás
    database.query(sqlcommand, (err, rows) => {    //Meghívás lekérdezés
        if (err) throw err;  //nem sikerült
        res.send(rows); //Sikerült
    });
});

app.get('/tagok/:id', (req, res) => {                                      //http://localhost:3005/tagok/[azon]
    let sqlcommand = `SELECT * FROM ugyfel WHERE azon=${req.params.id}`;   //Lekérdezés azonosító szerint parancs tárolás
    database.query(sqlcommand, (err, rows) => {                           //Meghívás lekérdezés
        if (err) throw err;  //nem sikerült
        res.send(rows); //Sikerült
    });
});

//UPDATE



//DELETE




//******************* */
//*******CRUD******** */
//******************* */

app.listen(3005, () => {
    console.log('A szerver fut a 3005-s porton'); //localhost:3000
});
// app.listen után nem szabad írni bajos lehet a futása
