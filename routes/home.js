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
router.get("/register", (req, res) => {
    res.render("register", { title: "Register" });
});
router.get("/results", (req, res) => {
    res.render("results");
});
router.get("/statistics", (req, res) => {
    res.render("statistics");
}); 
module.exports = router;
