const express = require('express');
module.exports =(dbs) =>{
    const router = express.Router();
    router.get('/',(req,res)=>{
        res.render("candidates");
    });

    router.get('/add', (req, res) => {
        const peopleSql = `
            SELECT NationalID, FirstName, Surname
            FROM Person
            WHERE NationalID NOT IN (SELECT NationalID FROM Candidate)
        `;
        const partySql = 'SELECT PartyID, PartyName FROM Party';
        const positionSql = 'SELECT PositionID, Title FROM Positions';

        dbs.query(peopleSql, (err, people) => {
            if (err) return res.status(500).send("Error fetching people.");
            dbs.query(partySql, (err, parties) => {
                if (err) return res.status(500).send("Error fetching parties.");
                dbs.query(positionSql, (err, positions) => {
                    if (err) return res.status(500).send("Error fetching positions.");
                    res.render('add_candidates', {
                        people,
                        parties,
                        positions
                    });
                });
            });
        });
    });
    router.post('/add',(req,res)=>{
        const { nationalID, partyID, positionID } = req.body;
        if (!nationalID || !partyID || !positionID) {
            return res.status(400).send("All fields are required.");
        }

        const sql = `
            INSERT INTO Candidate (NationalID, PartyID, PositionID)
            VALUES (?, ?, ?)
        `;
        dbs.query(sql, [nationalID, partyID, positionID], (err, result) => {
            if (err) {
                console.error("Error adding candidate:", err);
                return res.status(500).send("Error adding candidate.");
            }
            res.render('candidate_success', {
                title: "Candidate Registered",
                message: "Candidate has been successfully registered."
            });
        });
    });

    router.get('/edit', (req, res) => {
        const candidateSql = `
            SELECT c.CandidateID, p.FirstName, p.Surname, pr.PartyName, pos.Title AS PositionTitle
            FROM Candidate c
            JOIN Person p ON c.NationalID = p.NationalID
            LEFT JOIN Party pr ON c.PartyID = pr.PartyID
            LEFT JOIN Positions pos ON c.PositionID = pos.PositionID
        `;
        const partySql = `SELECT PartyID, PartyName FROM Party`;
        const positionSql = `SELECT PositionID, Title FROM Positions`;

        dbs.query(candidateSql, (err, candidates) => {
            if (err) return res.status(500).send("Error fetching candidates.");
            dbs.query(partySql, (err, parties) => {
                if (err) return res.status(500).send("Error fetching parties.");
                dbs.query(positionSql, (err, positions) => {
                    if (err) return res.status(500).send("Error fetching positions.");
                    res.render('edit_candidates', {
                        candidates,
                        parties,
                        positions
                    });
                });
            });
        });
    });
    router.get('/view', (req, res) => {
        const presidentSql = `
        SELECT c.CandidateID, per.FirstName, per.Surname, p.PartyName, pos.Title AS PositionName
        FROM Candidate c
        LEFT JOIN Person per ON c.NationalID = per.NationalID
        LEFT JOIN Party p ON c.PartyID = p.PartyID
        LEFT JOIN Positions pos ON c.PositionID = pos.PositionID
        WHERE c.PositionID = 1
    `;

        const mpSql = `
        SELECT c.CandidateID, per.FirstName, per.Surname, p.PartyName, pos.Title AS PositionName, con.ConstituencyName
        FROM Candidate c
        LEFT JOIN Person per ON c.NationalID = per.NationalID
        LEFT JOIN Party p ON c.PartyID = p.PartyID
        LEFT JOIN Positions pos ON c.PositionID = pos.PositionID
        LEFT JOIN Constituency con ON per.NationalID = c.NationalID -- link via voter/constituency if you have that table
        WHERE c.PositionID = 2
    `;

        const councillorSql = `
        SELECT c.CandidateID, per.FirstName, per.Surname, p.PartyName, pos.Title AS PositionName, w.WardName
        FROM Candidate c
        LEFT JOIN Person per ON c.NationalID = per.NationalID
        LEFT JOIN Party p ON c.PartyID = p.PartyID
        LEFT JOIN Positions pos ON c.PositionID = pos.PositionID
        LEFT JOIN Ward w ON per.NationalID = c.NationalID -- adjust depending on how ward is linked
        WHERE c.PositionID = 3
    `;

        dbs.query(presidentSql, (err, presidents) => {
            if (err) return res.status(500).send("Database error: Presidents");

            dbs.query(mpSql, (err, mps) => {
                if (err) return res.status(500).send("Database error: MPs");

                dbs.query(councillorSql, (err, councillors) => {
                    if (err) return res.status(500).send("Database error: Councillors");

                    res.render('view_candidates', { presidents, mps, councillors });
                });
            });
        });
    });
    router.post('/edit', (req, res) => {
        const { id, newParty, newPosition } = req.body;

        const updateCandidate = `
            UPDATE Candidate
            SET PartyID = ?, PositionID = ?
            WHERE CandidateID = ?
        `;

        dbs.query(updateCandidate, [newParty, newPosition, id], (err, result) => {
            if (err) {
                return res.status(500).send("Error updating candidate.");
            }
            // Render the success page
            res.render('candidate_success', {
                title: "Candidate Updated",
                message: "Candidate details have been successfully updated."
            });
        });
    });

    return router;
};
