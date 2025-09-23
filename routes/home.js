const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home");
});
router.get("/candidates", (req, res) => {
    res.render("candidates");
});
router.get("/home", (req, res) => {
    res.render("home");
});
router.get("/vote", (req, res) => {
    res.render("vote");
});

module.exports = router;
