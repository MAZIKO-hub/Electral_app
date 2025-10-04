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
router.get("/voters", (req, res) => {
    res.render("voters");
});
router.get("/parties", (req, res) => {
    res.render("parties");
}); 
router.get("/results", (req, res) => {
    res.render("results");
});
router.get("/statistics", (req, res) => {
    res.render("statistics");
}); 
// router.get("/people", (req, res) => {
//     res.render("people");
// });

module.exports = router;
