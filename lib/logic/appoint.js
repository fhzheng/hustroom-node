var moment = require('moment');
var SqlString = require('sqlstring');
function getModel(){
    return global.Models.use('Appointment');
}
module.exports = {
    addApt: function(apt, options){
        var date = apt.date,
        start = parseInt(apt.start),
        end = parseInt(apt.end);
        if(!moment(date, 'YYYY-MM-DD', true).isValid() || isNaN(end) || isNaN(start)) {
            console.log('invalid');
            options.fail(new TypeError('Date not valid'))
        }
        else if(start > end){
            options.fail(new RangeError('Start after end'))
        }
        else{
            var uaModel = getModel();
            uaModel.add(apt, {
                success: function(){
                    options.success()
                },
                fail: function(err){
                    options.fail(err)
                }
            })
        }
    },

    retrieveApt: function(aptMap, options){
        for(var i in aptMap){
            aptMap[i] = SqlString.escape(aptMap[i])
        }
        var uaModel = getModel();
        uaModel.retrieve(aptMap, {
            success: function(results){
                options.success(results)
            },
            fail: function(err){
                options.fail(err)
            }
        })
    },

    dismissApt: function(aptId, options){
        var uaModel = getModel();
        uaModel.update(aptId, 0, {
            fail: function(err){
                options.fail(err)
            },
            success: function(err){
                options.success(aptId)
            }
        })
    }
}