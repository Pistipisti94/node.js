/*Terminál
npm -y létrehozza a json csomagot
npm install express telepíti a többi csomagot
npm install mysql telepíti az adatbázis kapcsolathoz szügséges csomagokat
npm install cors telepíti a liveszerver használatához szügséges csomagot
A mappába létrehoztunk egy fájlt aminek a neve ".gitignore" ennek a tartalma /node_modules/
node index.js  parancs indítja el a szervert
Ctrl + C állítja le a szervert
*/
//Visual Studio Code-ba a Thunder Client extension-t hozzáadtuk (Ennek a használatában én se tudok segíteni) 
//Index.js
const express = require('express'); //express létrehozása
const app = express(); //-- http szervert tudunk vele indítani

const bodyParser = require('body-parser'); //bodyParser létrehozása

const cors = require('cors');  //cors létrehozása
app.use(cors);                  //cors használata

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

app.get('/', (req, res) => { // http://localhost:3000 esetén
    res.send("Csá öcsi"); // ezt írja ki
});

app.get('/sanyi', (req, res) => { //  http://localhost:3000/sanyi esetén 
    res.send("Sanyi öcsém");        // ezt írja ki
});

app.get('/sanyi/:id', (req, res) => {       //http://localhost:3000/sanyi/"akármilyen id [pl 11]"
    let id = req.params.id;                 // id request
    let nev = req.params.nev;               // név request
    res.send("Sanyi öcsém, id:" + id + `Név: ${nev}`);      //ezt írja ki
});

app.get('/sanyi/lakcim', (req, res) => {    //http://localhost:3000/sanyi/lakcim
    res.send("Sanyi öcsém az Északisarkon lakik");   //ezt írja ki
});

//POST

app.post('/sanyi', (req, res) => { //küldeni sanyinak adatokat
    let id = req.body.id; //adat
    let nev = req.body.nev; //adat
    res.send(`Sanyi öcsém POST, id: ${id}, név: ${nev} `);  //kiírás      
});

//Adatbázis lekérdezése
app.get('/tagok', (req, res) => {                   //http://localhost:3000/tagok
    let sqlcommand = 'SELECT * FROM `ugyfel`';   //Lekérdezés parancs tárolás
    database.query(sqlcommand, (err, rows) => {    //Meghívás lekérdezés
        if (err) throw err;  //nem sikerült
        res.send(rows); //Sikerült
    });
});

app.get('/tagok/:id', (req, res) => {                                      //http://localhost:3000/tagok/[azon]
    let sqlcommand = `SELECT * FROM ugyfel WHERE azon=${req.params.id}`;   //Lekérdezés azonosító szerint parancs tárolás
    database.query(sqlcommand, (err, rows) => {                           //Meghívás lekérdezés
        if (err) throw err;  //nem sikerült
        res.send(rows); //Sikerült
    });
});


app.listen(3000, () => {
    console.log('A szerver fut a 3000-s porton'); //localhost:3000
});
// app.listen után nem szabad írni bajos lehet a futása
