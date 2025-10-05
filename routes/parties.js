const express = require("express");

module.exports = (dbs) => {
    const router = express.Router();
    router.get("/parties", (req, res) => {
        const sql = "SELECT PartyID, PartyName, NumberOfCandidatesRunning FROM Party";
        dbs.query(sql, (err, parties) => {
            if (err) {
                return res.status(500).send("Database error: " + err.message);
            }
            res.render("parties", { parties });
        });
    });
    return router;
};