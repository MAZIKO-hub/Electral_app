const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const vote_routes = require('./routes/home');
app.use('/', vote_routes);


const dbs = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'electral_app_dbs'    
})


dbs.connect(error=>{
    if(error){
        console.error('database could not connect: ' + error.stack);
        process.exit(1);
    }
    console.log(`database connected ${dbs.threadId}`);
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
