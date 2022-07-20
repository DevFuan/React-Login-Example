var mysql = require('mysql');
var pool;

function getPool(){ // 없으면 pool 생성 있으면 기존 pool 반환
    if(!pool){
        pool = mysql.createPool({
            host: 'localhost',
            port: 3306,
            user: 'root',
            database: 'user',
            password: 'Qkfkrh2@22'
        });
        return pool;
    }
    return pool;
}
module.exports.getPool = getPool;