/* define a model 'Appointment' */
var dbBase = require('./dbBase')
Models.define('Appointment', function(out, db, cache) {
    out.name = 'Appointment';

    out.add = function(ua, options){

        var tscDb = dbBase.getTscDb();

        tscDb.beginTransaction(function(err, transaction){
            if(err){
                //TODO
            }
            transaction.get(sql = `select count(1) as co from user_room_appoint where date = "${ua.date}" and ( (start >= ${ua.start} and start <= ${ua.end}) or (end >= ${ua.start} and end <= ${ua.end}))`, function(err, row){
                console.log(sql)
                if(row.co != 0){
                    console.log('has existed')
                    transaction.rollback(function(err){
                        if(err) {
                            console.log('rollback error', err)
                            options.fail(err)
                        }
                        else{
                            options.fail('date time conflicted')
                        }
                    });
                }
                else{
                    var uaM = {};
                    Object.keys(ua).forEach(function(key) { uaM['$'+key] = ua[key]});
                    uaM.$ctime = Date.now();
                    transaction.run(`insert into user_room_appoint(user_id, room_id, date, start, end, ctime) values
                    ($userId, $roomId, $date, $start, $end, $ctime)`, uaM, modelDomain.bind(err => {
                        if(err){
                            console.log(err)
                            transaction.rollback(function(rb_err){
                                if(rb_err){
                                    options.fail(rb_err)
                                }
                                else{
                                    options.fail(err)
                                }
                            })
                        }else{
                            transaction.commit(function(err){
                                if(err){
                                    options.fail(err)
                                }
                                else{
                                    options.success()
                                }
                            });
                        }
                    }))
                }
            })
        })
        
    }
    out.get = function(uaId, callback){
        var sql = `select * from user_room_appoint where id = "${uaId}"`;
        var _db = dbBase.getDb()
        _db.get(sql, modelDomain.bind((err, row) => {
            _db.close()
            if(err) throw err
            else {
                if(typeof callback === 'function') callback(row)
            }
        }))
    }
    out.retrieve = function(uaMap, options){
        var condition = [];
        for(var key in uaMap){
            condition.push(`${key}="${uaMap[key]}"`);
        }
        condition = condition.join(' and ');
        var sql = `select * from user_room_appoint where ${condition}`;
        var _db = dbBase.getDb();
        console.log(sql)
        _db.all(sql, modelDomain.bind((err, rows) => {
            _db.close()
            if(err) {
                options.fail(err)
                throw err
            }
            else{
                options.success(rows)
            }
        }))
    }
    out.update = function(uaId, status, options){
        var sql = `update user_room_appoint set status = "${status}", utime = "${Date.now()}" where id= "${uaId}"`;
        var tscDb = dbBase.getTscDb();
        console.log(sql)
        tscDb.beginTransaction(function(err, transaction){
            if(err){
                //TODO
            }
            transaction.run(sql, function(ts_err){
                if(ts_err){
                    transaction.rollback(function(rb_err){
                        if(rb_err) options.fail(rb_err)
                        else options.fail(ts_err)
                    })
                }
                else{
                    transaction.commit(function(co_err){
                        if(co_err){
                            options.fail(co_err)
                        }
                        else{
                            options.success()
                        }
                    })
                }
            })
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

