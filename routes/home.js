const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home");
});
router.get("/candidates.ejs", (req, res) => {
    res.render("candidates");
});
router.get("/home.ejs", (req, res) => {
    res.render("home");
});
router.get("/voters.ejs", (req, res) => {
    res.render("voters");
});

module.exports = router;
