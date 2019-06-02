let mysql = require('mysql');

let conn = mysql.createConnection({
    host : 'localhost',
    user : 'nodeuser',
    password : '123456',
    database : 'session'
})
conn.connect();
let sql = 'select * from user';
let data = null;
conn.query(sql,data,(err,res)=>{
    if(err) throw err;
    if(res) console.log(res);
})
conn.end();