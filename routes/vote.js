const express = require('express');
module.exports =(dbs) =>{
    const router = express.Router();
    router.get('/',(req,res)=>{
        res.render("vote");
    });
    router.get('/vote',(req,res)=>{
        res.render("vote");
    });

    router.get('/register',(req,res)=>{
        res.render("register");
    });
    // router.post('/add',(req,res)=>{
    //     const {name, party} = req.body;
    //     if(!name || !party){
    //         return res.status(400).send('Name and Party are required');
    //     }

    //     const sql = 'INSERT INTO candidates (name, party) VALUES (?, ?)';
    //     dbs.query(sql, [name, party], (err, result) => {
    //         if (err) {
    //             return res.status(500).send('Database error');
    //         }
    //         res.redirect('/candidates');
    //     });
    // });

    router.get('/cast_vote',(req,res)=>{
        res.render("cast_vote");
    });
    return router;
};
