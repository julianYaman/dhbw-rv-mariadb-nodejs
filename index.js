const express = require('express')
const pool = require('./db')
const app = express()
const port = 8080

app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.render('index')
})

// Disclaimer: I know these names are very bad but idc.

app.get('/autor-auswahl', async (req, res) => {
    res.render('autor', {data: false, searched: false, query: false})
});

app.post('/autor-auswahl-query', async (req, res) => {
    let conn;
    console.log(conn)
    try {
        // establish a connection to MariaDB
        conn = await pool.getConnection();
        console.log(req.body)

        let vorname = req.body.autor_vorname;
        let nachname = req.body.autor_nachname;

        // create a new query
        let query = 'SELECT Buch.Titel AS "Buchtitel", CONCAT(Autor.Vorname," ",Autor.Name) AS "Autor" FROM Buch, Autor ' +
            'RIGHT JOIN AutorBuchZuord ON Autor.AutorId = AutorBuchZuord.AutorId ' +
            'WHERE AutorBuchZuord.BuchId = Buch.BuchId AND Autor.Vorname LIKE "%' + vorname +  '%" AND Autor.Name LIKE "%' + nachname + '%";';

        console.log(query)

        // execute the query and set the result to a new variable
        let rows = await conn.query(query);

        // return the results
        res.render('autor', {data: rows, searched: vorname + ' ' + nachname, query: query})
    } catch (err) {
        res.send(err);
    } finally {
        if (conn) return conn.release();
    }
});

app.get('/titel', async (req, res) => {
    res.render('titel', {data: false, searched: false, query: false})
});

app.post('/titel-query', async (req, res) => {
    let conn;
    console.log(conn)
    try {
        // establish a connection to MariaDB
        conn = await pool.getConnection();
        console.log(req.body)

        let titel = req.body.titel;

        // create a new query
        let query = 'SELECT Titel, ISBNnummer  FROM Buch WHERE Titel LIKE "%' + titel + '%";';

        console.log(query)

        // execute the query and set the result to a new variable
        let rows = await conn.query(query);

        // return the results
        res.render('titel', {data: rows, searched: titel, query: query})
    } catch (err) {
        res.send(err);
    } finally {
        if (conn) return conn.release();
    }
});

app.get('/sorte', async (req, res) => {
    res.render('sorte', {data: false, searched: null, query: false})
});

app.post('/sorte-query', async (req, res) => {
    let conn;
    console.log(conn)
    try {
        // establish a connection to MariaDB
        conn = await pool.getConnection();
        console.log(req.body)

        let sorte = req.body.sorte;

        // create a new query
        let query = 'SELECT Buch.Titel AS "Buchtitel", Buchsorte.Name as BuchsorteName FROM Buch RIGHT JOIN Buchsorte ' +
            'ON Buchsorte.BuchsorteId = Buch.BuchsorteId ' +
            'WHERE Buchsorte.Name LIKE "%' + sorte + '%";';

        console.log(query)

        // execute the query and set the result to a new variable
        let rows = await conn.query(query);

        // return the results
        res.render('sorte', {data: rows, searched: sorte, query: query})
    } catch (err) {
        res.send(err);
    } finally {
        if (conn) return conn.release();
    }
});

app.get('/buecher', async (req, res) => {
    let conn;
    try {
        // establish a connection to MariaDB
        conn = await pool.getConnection();

        // create a new query
        let query = "select * from Buch limit 1";

        // execute the query and set the result to a new variable
        let rows = await conn.query(query);

        // return the results
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});

// Start the thing!
app.use(function(req, res) {
    res.status(404).redirect('https://yaman.pro/');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
