const express = require('express');
module.exports =(dbs) =>{
    const router = express.Router();
    router.get('/',(req,res)=>{
        res.render("candidates");
    });

    router.get('/add',(req,res)=>{
        res.render("add_candidates");
    });
    router.post('/add',(req,res)=>{
        const {name, party} = req.body;
        if(!name || !party){
            return res.status(400).send('Name and Party are required');
        }

        const sql = 'INSERT INTO candidates (name, party) VALUES (?, ?)';
        dbs.query(sql, [name, party], (err, result) => {
            if (err) {
                return res.status(500).send('Database error');
            }
            res.redirect('/candidates');
        });
    });

    router.get('/edit',(req,res)=>{
        res.render("edit_candidates");
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

    return router;
};
