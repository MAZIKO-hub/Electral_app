const express = require("express");
const router = express.Router();

module.exports = (dbs) => {
    router.post("/register", (req, res) => {
        const { nationalID, status, pollingStationID } = req.body;

        const checkPerson = "SELECT * FROM Person WHERE NationalID = ?";
        dbs.query(checkPerson, [nationalID], (err, results) => {
            if (err) {
                console.error(" Error checking person:", err);
                return res.status(500).send("Database error while checking person.");
            }

            if (results.length === 0) {

                return res.send(`
                    <h2>Person with National ID ${nationalID} not found.</h2>
                    <p>Please ensure they are registered in the Person table first.</p>
                    <a href="/home">Go Back</a>
                `);
            }

            const insertVoter = `
                INSERT INTO Voter (NationalID, PollingStationID)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE PollingStationID = VALUES(PollingStationID)
            `;

            dbs.query(insertVoter, [nationalID, pollingStationID || null], (err) => {
                if (err) {
                    console.error(" Error inserting voter:", err);
                    return res.status(500).send("Error inserting voter record.");
                }
                const getLastReg = "SELECT RegID FROM Registration ORDER BY RegID DESC LIMIT 1";
                dbs.query(getLastReg, (err, results) => {
                    if (err) {
                        console.error("Error fetching last RegID:", err);
                        return res.status(500).send("Error generating registration ID.");
                    }

                    let newRegID = "REG001";
                    if (results.length > 0) {
                        const lastRegID = results[0].RegID;
                        const num = parseInt(lastRegID.replace("REG", ""), 10) + 1;
                        newRegID = "REG" + num.toString().padStart(3, "0");
                    }

                    const today = new Date().toISOString().slice(0, 10);

                    const insertRegistration = `
                        INSERT INTO Registration (RegID, NationalID, RegDate, Status, PollingStationID)
                        VALUES (?, ?, ?, ?, ?)
                    `;

                    dbs.query(insertRegistration, [newRegID, nationalID, today, status, pollingStationID || null], (err) => {
                        if (err) {
                            console.error(" Error inserting into Registration:", err);
                            return res.status(500).send("Error saving registration.");
                        }

                        console.log(` Registration complete for ${nationalID} (${newRegID})`);
                        res.redirect("/vote");
                    });
                });
            });
        });
    });

    return router;
};