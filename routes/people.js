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
    router.get("/observers", (req, res) => {
        const sql = `
        SELECT 
            o.ObserverID,
            o.Name,
            o.Organization,
            o.Contact,
            d.DistrictName AS AssignedDistrict
        FROM Observer o
        LEFT JOIN District d ON o.AssignedDistrictID = d.DistrictID
    `;

        dbs.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching observers:", err);
                return res.status(500).send("Database error.");
            }

            console.log("Observers fetched:", results.length);
            res.render("observers", { observers: results });
        });
    });
    router.get("/election_officials", (req, res) => {
        const sql = `
        SELECT 
            eo.OfficialID,
            eo.NationalID,
            p.FirstName,
            p.Surname,
            eo.Role,
            ps.StationName AS AssignedStation,
            w.WardName,
            c.ConstituencyName,
            eo.DateAssigned
        FROM ElectionOfficial eo
        INNER JOIN Person p ON eo.NationalID = p.NationalID
        LEFT JOIN PollingStation ps ON eo.AssignedStationID = ps.PollingStationID
        LEFT JOIN Ward w ON ps.WardID = w.WardID
        LEFT JOIN Constituency c ON w.ConstituencyID = c.ConstituencyID
        ORDER BY eo.DateAssigned DESC
    `;

        dbs.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching officials:", err);
                return res.status(500).send("Database error.");
            }

            console.log("Officials fetched:", results.length);
            res.render("officials", {
                title: "Election Officials",
                officials: results
            });
        });
    });

    return router;
};
