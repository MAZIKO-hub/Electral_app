const express = require("express");
const router = express.Router();

module.exports = (dbs) => {
    router.get('/results', (req, res) => {
        const sql = `
        SELECT 
            pos.Title AS Position,
            p.FirstName,
            p.Surname,
            party.PartyName,
            c.ConstituencyName,
            w.WardName,
            COUNT(v.VoteID) AS VoteCount
        FROM Vote v
        INNER JOIN Candidate cand ON v.CandidateID = cand.CandidateID
        INNER JOIN Person p ON cand.NationalID = p.NationalID
        LEFT JOIN Party party ON cand.PartyID = party.PartyID
        INNER JOIN Positions pos ON cand.PositionID = pos.PositionID
        LEFT JOIN MemberOfParliament mp ON cand.CandidateID = mp.CandidateID
        LEFT JOIN Constituency c ON mp.ConstituencyID = c.ConstituencyID
        LEFT JOIN Councillor coun ON cand.CandidateID = coun.CandidateID
        LEFT JOIN Ward w ON coun.WardID = w.WardID
        GROUP BY cand.CandidateID, pos.Title, p.FirstName, p.Surname, party.PartyName, c.ConstituencyName, w.WardName
        ORDER BY pos.PositionID, VoteCount DESC
    `;

        dbs.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching results:", err);
                return res.status(500).send("Database error");
            }

            res.render('results', {
                title: 'Election Results',
                results: results
            });
        });
    });
    return router;
};