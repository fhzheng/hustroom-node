/* define a model 'User' */
var dbBase = require('./dbBase')
Models.define('User', function(out, db, cache) {
    out.status = {
        FROZEN: -1,
        NORMAI: 0,
        AUTH: 1
    }
    out.STATUS_FROZEN = -1;
    out.STATUS_NORMAL = 0;
    out.STATUS_AUTH = 1;
    out.name = 'user';
    out.getName = function(){
        return out.name;
    }
    out.add = function(user, callback){
        var _this = out;
        var sql = `insert into user
        (open_id, nick_name, avatar, gender, language, city, province, country, ctime )
        values ($openId, $nickName, $avatarUrl, $gender, $language, $city, $province, $country, $ctime)`;
        var _db = dbBase.getDb();
        var userM = {};
        Object.keys(user).forEach(function(key) { userM['$'+key] = user[key]});
        userM.$ctime = Date.now();
        _db.run(sql, userM, modelDomain.bind(err => {
            _db.close()
            if(err) throw err
            else{
                _this.getByOpenId(user.openId, function(result){
                    if(typeof callback === 'function') callback(result)
                })
            }
        }))
    }
    out.retrieve = function(userMap, callback){
        var condition = [];
        for(var key in userMap){
            condition.push(`${key}="${userMap[key]}"`);
        }
        condition = condition.join(' and ');
        var sql = `select * from user where ${condition}`;
        var _db = dbBase.getDb();
        _db.get(sql, modelDomain.bind((err, row) => {
            _db.close()
            if(err) throw err
            else{
                if(typeof callback === 'function') callback(row)
            }
        }))
    }
    out.getByOpenId = function(openId, callback){
        var sql = `select * from user where open_id = "${openId}"`;
        var _db = dbBase.getDb();
        console.log(sql);
        _db.get(sql, modelDomain.bind((err, row) => {
            _db.close()
            if(err) throw err
            else {
                if(typeof callback === 'function') callback(row)
            }
        }))
    }
    out.getById = function(userId, callback){
        var sql = `select * from user where id = "${userId}"`;
        var _db = dbBase.getDb();
        console.log(sql);
        _db.get(sql, modelDomain.bind((err, row) => {
            _db.close()
            if(err) throw err
            else {
                if(typeof callback === 'function') callback(row)
            }
        }))
    }
    out.changeStatus = function(userId, status, callback){
        var sql = `update user set status = ${status} where id = ${userId}`;
        var _db = dbBase.getDb();
        _db.run(sql, function(err){
            if(err) console.log(err)
        })
    }
    db.use('sqlite3', {
        apply: function(node, arg){
            dbBase.db = arg[0];
        }
    })
    out._constructor = function(){
        return out;
    }

})

