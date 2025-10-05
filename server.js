const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbs = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'electral_app_dbs',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const results_routes = require('./routes/results')(dbs);
app.use('/', results_routes);
// const statistics_routes = require('./routes/statistics')(dbs);
// app.use('/', statistics_routes);
const parties_routes = require('./routes/parties')(dbs);
app.use('/', parties_routes);
const candidates_routes = require('./routes/candidates')(dbs);
app.use('/candidates', candidates_routes);
const register_routes = require('./routes/register')(dbs);
app.use('/', register_routes);
const people_routes = require('./routes/people')(dbs);
app.use('/', people_routes);

const vote_routes = require('./routes/home');
app.use('/', vote_routes);

const candidate_routes = require('./routes/candidates')(dbs);
app.use('/candidates', candidate_routes);

const vote = require('./routes/vote')(dbs);
app.use('/vote', vote);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

dbs.getConnection((error, connection) => {
    if (error) {
        console.error('database could not connect: ' + error.stack);
        process.exit(1);
    }
    console.log(`database connected ${connection.threadId}`);
    connection.release();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});


