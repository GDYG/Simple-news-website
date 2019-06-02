let mysql = require('mysql');

exports.base=(sql,data,callback)=>{
    let connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'root',
        database:'session'
    });
    connection.connect();

//封装数据库操作
    connection.query(sql,data,(err,results,fields)=>{
        if(err){
            throw err;
        }else if (results)
        {
            callback(results);
        }
    })
    connection.end();
}
