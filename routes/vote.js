const express = require('express');
module.exports = (dbs) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.render("vote");
    });

    router.get('/vote', (req, res) => {
        res.render("vote");
    });

    router.get('/register', (req, res) => {
        res.render("register");
    });


    router.get('/cast_vote',(req,res)=>{
        res.render("cast_vote");
    });
    return router;
};
