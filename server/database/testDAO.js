var dbcon = require('./dbcon')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const saltRounds = 10;

// schema
class User_schema{
    constructor(){
        this._id  = null
        this.email = null
        this.password = null
        this.name = null
        this.role = null
        this.isAuth = null
        this.token = null
    }
}

function RegisterUser(body,next) {
    var con = dbcon.getPool()
    
    con.getConnection((err, connection) => {
        if(err){
            console.error("err : " + err);
            return next(err);
        }

        var query = 'insert into user_schema (name, email, password) values (?, ?, ?)'
        var values = [body.name,body.email,body.password]

        connection.query(query, values, function (err, results){
            if(err){
                console.error("err : " + err);
                return next(err);
            }
            console.log("rows : " + results.insertId);
            
            connection.release();
            next()
        })
    })
}

function FindEmail(email,next){
    var con = dbcon.getPool();

    con.getConnection((err, connection) => {
        if(err){
            console.error("err : " + err);
            return next(err);
        }

        var query = 'select * from user_schema where email = ? limit 1'
        var values = [email]

        connection.query(query, values, function (err, rows){
            if(err){
                console.error("err : " + err);
                return next(err);
            }
            console.log("id : " + JSON.stringify(rows[0]));
            connection.release();
            next(null,rows[0])
        })
    })
}

function Logout(id,next){
    var con = dbcon.getPool();

    con.getConnection((err, connection) => {
        if(err){
            console.error("err : " + err);
            return next(err);
        }

        var query = 'update user_schema set token = ? where id = ?;'
        var values = [null,id]

        connection.query(query, values, function (err, result, fields){
            if(err){
                console.error("err : " + err);
                return next(err);
            }
            console.log("logout result : " + JSON.stringify(result));
            connection.release();
            next()
        })
    })
}

function FindbyToken(token,next){
    var con = dbcon.getPool();

    jwt.verify(token, 'secretToken', function(err, decoded) {
        // user.findOne({"_id": decoded, "token": token}, function(err, user) {
        //     if(err) return cb(err)
        //     cb(null, user)
        // })

        con.getConnection((err, connection) => {
            if(err){
                console.error("err : " + err);
                return next(err);
            }
    
            var query = 'select * from user_schema where id = ?'
            var values = [decoded.identify]
    
            connection.query(query, values, function (err, result, fields){
                if(err){
                    console.error("err : " + err);
                    return next(err);
                }
                
                if(result[0].token === null){
                    console.error("Empty Token");
                    return next();
                }
                
                connection.release();
                next(null,result[0])
            })
        })
    })

    
}

function bcryptPassword(pw , dbpw , next){
    console.log('bcryptPassword : '+ pw +" "+dbpw)
    if(pw !== dbpw){
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(pw, salt, null, function(err, hash) {
                if(err) return next(err)
                pw = hash

                console.log(pw)
                next(null,hash)
            })
        })
    } else {
        next()
    }
}

function comparePassword(pw, dbpw, cb) {
    console.log(pw, dbpw)
    bcrypt.compare(pw , dbpw, function(err, isMatch) {
        if(err) return cb(err)
            cb(null, isMatch)
    })
}

function generateToken(id ,cb) {
 
    console.log('identify : '+id)
    var id_json = { identify : id }
    var token = jwt.sign(id_json, 'secretToken')
    var con = dbcon.getPool();

    con.getConnection((err, connection) => {
        if(err){
            console.error("err : " + err);
            return cb(err);
        }

        var query = 'update user_schema set token = ? where id = ?'
        var values = [token,id]

        connection.query(query, values, function (err,result,fields){
            if(err){
                console.error("err : " + err);
                return cb(err);
            }
            connection.release();
            cb(null,token)
        })
    })
}

module.exports.generateToken = generateToken;
module.exports.bcryptPassword = bcryptPassword;
module.exports.comparePassword = comparePassword;
module.exports.RegisterUser = RegisterUser;
module.exports.FindEmail = FindEmail;
module.exports.Logout = Logout;
module.exports.FindbyToken = FindbyToken;
module.exports.User_schema = User_schema;