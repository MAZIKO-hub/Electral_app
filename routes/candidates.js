const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("candidates");
});
router.get("/home.ejs", (req, res) => {
    res.render("home");
});

module.exports = router;
