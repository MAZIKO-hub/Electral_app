const express = require("express");
const router = express.Router();
module.exports = (dbs) => {
    router.get("/people", (req, res) => {
        console.log("✅ /people route hit");
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

    return router;
};
