//*1.0 */
const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs'); // EJS beállítása sablonmotorként
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
  });
  
  // Szerver indítása
  app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} címen.`);
  });

// Adatbázis kapcsolat beállítása
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tagdij'
});

// Adatbázis kapcsolódás
db.connect((err) => {
  if (err) {
    console.error('Hiba a MySQL kapcsolat során: ' + err.stack);
    return;
  }
  console.log('Sikeres MySQL kapcsolat, ID: ' + db.threadId);
});

// Middleware a JSON kérési/testválasz kezelésére
app.use(express.json());








