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

const dbs = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'electral_app_dbs'
});

const vote_routes = require('./routes/home');
app.use('/', vote_routes);

const candidate_routes = require('./routes/candidates')(dbs);
app.use('/candidates', candidate_routes);

const vote = require('./routes/vote')(dbs);
app.use('/vote', vote);

app.post("/voter/register", (req, res) => {
    const { nationalID, firstName, surname, gender, age, status, pollingStationID } = req.body;

    const insertPerson = `
        INSERT INTO Person (NationalID, FirstName, Surname, Gender, Age)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            FirstName = VALUES(FirstName),
            Surname = VALUES(Surname),
            Gender = VALUES(Gender),
            Age = VALUES(Age)
    `;

    dbs.query(insertPerson, [nationalID, firstName, surname, gender, age], (err) => {
        if (err) {
            console.error("Error inserting into Person:", err);
            return res.status(500).send("Error saving person.");
        }

        const insertVoter = `
            INSERT INTO Voter (Status, NationalID, PollingStationID)
            VALUES (?, ?, ?)
        `;

        dbs.query(insertVoter, [status, nationalID, pollingStationID], (err) => {
            if (err) {
                console.error("Error inserting into Voter:", err);
                return res.status(500).send("Error saving voter.");
            }

            console.log("Voter registered:", nationalID);
            res.redirect("/vote");
        });
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

dbs.connect(error => {
    if (error) {
        console.error('database could not connect: ' + error.stack);
        process.exit(1);
    }
    console.log(`database connected ${dbs.threadId}`);

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});


