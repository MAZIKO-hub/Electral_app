const express = require('express');
module.exports = (dbs) => {
    const router = express.Router();

    // Main vote page
    router.get('/', (req, res) => {
        res.render("vote", { title: "Vote" });
    });

    router.get('/vote', (req, res) => {
        res.render("vote", { title: "Vote" });
    });

    router.get('/register', (req, res) => {
        res.render("register", { title: "Register" });
    });

    // Check voter route
    router.post("/check_voter", (req, res) => {
        console.log("Request body:", req.body);

        const { nationalID } = req.body;

        console.log("Searching for NationalID:", nationalID);

        const checkVoter = `
            SELECT 
                p.NationalID,
                p.FirstName,
                p.Surname,
                p.Gender,
                p.Age,
                v.VoterID
            FROM Person p
            INNER JOIN Voter v ON p.NationalID = v.NationalID
            WHERE p.NationalID = ?
        `;

        dbs.query(checkVoter, [nationalID], (err, results) => {
            if (err) {
                console.error("Error checking voter:", err);
                return res.status(500).send("Database error: " + err.message);
            }

            console.log("Query results:", results);

            if (results.length > 0) {
                const voter = results[0];
                console.log("Voter found and registered:", voter);
                res.redirect("/vote/cast_vote");
            } else {
                console.log("No voter found with that NationalID");
                res.render("not_registered", {
                    title: "Not Found",
                    message: "Your National ID does not match our records. Please check and try again."
                });
            }
        });
    });
    router.get('/cast_vote', (req, res) => {
        const presidentSql = `
        SELECT c.CandidateID, p.FirstName, p.Surname, pr.PartyName, pos.Title AS Position
        FROM Candidate c
        JOIN Person p ON c.NationalID = p.NationalID
        LEFT JOIN Party pr ON c.PartyID = pr.PartyID
        JOIN Positions pos ON c.PositionID = pos.PositionID
        WHERE c.PositionID = 1
    `;
        const mpSql = `
        SELECT c.CandidateID, p.FirstName, p.Surname, pr.PartyName, pos.Title AS Position
        FROM Candidate c
        JOIN Person p ON c.NationalID = p.NationalID
        LEFT JOIN Party pr ON c.PartyID = pr.PartyID
        JOIN Positions pos ON c.PositionID = pos.PositionID
        WHERE c.PositionID = 2
    `;
        const councillorSql = `
        SELECT c.CandidateID, p.FirstName, p.Surname, pr.PartyName, pos.Title AS Position
        FROM Candidate c
        JOIN Person p ON c.NationalID = p.NationalID
        LEFT JOIN Party pr ON c.PartyID = pr.PartyID
        JOIN Positions pos ON c.PositionID = pos.PositionID
        WHERE c.PositionID = 3
    `;

        dbs.query(presidentSql, (err, presidents) => {
            if (err) return res.status(500).send("DB error: " + err.message);
            dbs.query(mpSql, (err, mps) => {
                if (err) return res.status(500).send("DB error: " + err.message);
                dbs.query(councillorSql, (err, councillors) => {
                    if (err) return res.status(500).send("DB error: " + err.message);

                    res.render('cast_vote', {
                        title: "Cast Your Vote",
                        presidents,
                        mps,
                        councillors
                    });
                });
            });
        });
    });

    // Submit vote route
    router.post('/submit_vote', (req, res) => {
        const { president, mp, councillor, voterID } = req.body;

        console.log("Vote submission:", req.body);

        // Insert votes into Vote table
        // You'll need to implement this based on your Vote table structure

        res.render("vote_success", {
            title: "Vote Submitted",
            message: "Thank you for voting! Your vote has been recorded."
        });
    });

    return router;
};
