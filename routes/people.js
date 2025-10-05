const express = require("express");
const router = express.Router();
module.exports = (dbs) => {
    router.get("/people", (req, res) => {
        const sql = "SELECT NationalID, FirstName, Surname, Gender, Age FROM Person";
        dbs.query(sql, (err, results) => {
            if (err) {
                console.error(" Error fetching people:", err);
                return res.status(500).send("Database error.");
            }
            console.log(" Retrieved people:");
            res.render("people", { people: results });
        });
    });
    router.get("/voters", (req, res) => {
        const sql = `
        SELECT 
            v.VoterID, 
            v.NationalID, 
            p.FirstName, 
            p.Surname,
            p.Gender,
            p.Age
        FROM Voter v
        JOIN Person p ON v.NationalID = p.NationalID
    `;

        dbs.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching voters:", err);
                return res.status(500).send("Database error.");
            }
            console.log("Voters fetched:", results.length);
            res.render("voters", { voters: results });
        });
    });

    return router;
};
