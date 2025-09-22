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
router.get("/voters", (req, res) => {
    res.render("voters");
});

module.exports = router;
