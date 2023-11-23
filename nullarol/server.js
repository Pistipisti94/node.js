const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// MySQL kapcsolat beállítása
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tagdij',
});

connection.connect((err) => {
    if (err) {
        console.error('Hiba a MySQL kapcsolatban: ' + err.stack);
        return;
    }
    console.log('Sikeres MySQL kapcsolat, azonosító: ' + connection.threadId);
});

// Statikus fájlok kiszolgálása (pl. CSS, képek)
app.use(express.static('public'));

// Express middleware beállítása
app.use(express.urlencoded({ extended: true }));

// Express middleware beállítása
app.use(express.urlencoded({ extended: true }));

// EJS sablonmotort használó nézetek beállítása
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Express útválasztók
app.get('/', (req, res) => {
    // Adatbázisból adatok lekérése "ugyfel" táblából
    connection.query('SELECT * FROM ugyfel', (err, results) => {
        if (err) throw err;

        // EJS nézet renderelése
        res.render('index', { ugyfelek: results });
    });
});

// Új ügyfél hozzáadása
app.post('/add', (req, res) => {
    const { azon, nev, szulev, irszam, orsz } = req.body;

    // Ellenőrizzük, hogy mindkét adat meg van-e adva
    if (!azon || !nev || !szulev || !irszam || !orsz) {
        return res.status(400).send('Minden mezőt ki kell tölteni.');
    }

    // Adatbázisba való beszúrás
    const query = 'INSERT INTO ugyfel (azon, nev, szulev, irszam, orsz) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [azon, nev, szulev, irszam, orsz], (err, result) => {
        if (err) throw err;

        console.log(`Sikeresen hozzáadva: ${azon}, ${nev}, ${szulev}, ${irszam}, ${orsz}`);
        res.redirect('/');
    });
});

// Adatok módosítása
app.post('/edit/:id', (req, res) => {
    const { azon, nev, szulev, irszam, orsz } = req.body;
    const userId = req.params.id;

    // Ellenőrizzük, hogy mindkét adat meg van-e adva
    if (!nev || !email) {
        return res.status(400).send('Minden mezőt ki kell tölteni.');
    }

    // Adatbázisban való módosítás
    const query = 'UPDATE ugyfel SET azon = ?, nev = ?, szulev = ?, irszam = ?, orsz = ? WHERE id = ?';
    connection.query(query, [azon, nev, szulev, irszam, orsz, userId], (err, result) => {
        if (err) throw err;

        console.log(`Sikeresen módosítva: ${azon}, ${nev}, ${szulev}, ${irszam}, ${orsz}`);
        res.redirect('/');
    });
});

// Az ügyfél módosításának oldala
app.get('/edit/:id', (req, res) => {
    const userId = req.params.id;

    // Adatbázisból adatok lekérése az adott ügyfélhez
    const query = 'SELECT * FROM ugyfel WHERE azon = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.status(404).send('Nem található az ügyfél.');
        }

        // EJS nézet renderelése
        res.render('edit', { ugyfel: results[0] });
    });
});

// Szerver indítása
app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} címen`);
});
