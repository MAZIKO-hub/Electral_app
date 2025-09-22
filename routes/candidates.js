const express = require('express');
module.exports =(dbs) =>{
    const router = express.Router();
    router.get('/',(req,res)=>{
        res.render("candidates");
    });

    router.get('/add',(req,res)=>{
        res.render("add_candidates");
    });
    router.post('/add',(req,res)=>{
        const {name, party} = req.body;
        if(!name || !party){
            return res.status(400).send('Name and Party are required');
        }

        const sql = 'INSERT INTO candidates (name, party) VALUES (?, ?)';
        dbs.query(sql, [name, party], (err, result) => {
            if (err) {
                return res.status(500).send('Database error');
            }
            res.redirect('/candidates');
        });
    });

    router.get('/edit',(req,res)=>{
        res.render("edit_candidates");
    });
    router.get('/view',(req,res)=>{
        res.render("view_candidates");
    });
    return router;
};
