/* define a model 'Room' */
var dbBase = require('./dbBase')
Models.define('Room', function(out, db, cache) {
    out.name = 'room';

    out.add = function(room, callback){
        var _this = out;
        var sql = `insert into room
        (name, desc, group_id, ctime)
        values ($name, $desc, $group_id, $ctime)`;
        var _db = dbBase.getDb();
        var roomM = {};
        Object.keys(room).forEach(function(key) { roomM['$'+key] = room[key]});
        roomM.$ctime = Date.now();
        _db.run(sql, roomM, modelDomain.bind(err => {
            _db.close()
            if(err) throw err
            else{
                if(typeof callback === 'function') callback()
            }
        }))
    }
    out.get = function(roomId, callback){
        var sql = `select * from room where id = "${roomId}"`;
        var _db = dbBase.getDb()
        _db.get(sql, modelDomain.bind((err, row) => {
            _db.close()
            if(err) throw err
            else {
                if(typeof callback === 'function') callback(row)
            }
        }))
    }
    out.retrieve = function(roomMap, callback){
        var condition = [];
        for(var key in roomMap){
            condition.push(`${key}="${roomMap[key]}"`);
        }
        condition = condition.join(' and ');
        var sql = `select * from room where ${condition}`;
        var _db = dbBase.getDb();
        _db.get(sql, modelDomain.bind((err, row) => {
            _db.close()
            if(err) throw err
            else{
                if(typeof callback === 'function') callback(row)
            }
        }))
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

