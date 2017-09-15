var express = require('express');
const session = require('wafer-node-session');
var FileStore = require('session-file-store')(session);
var app = express();
var models = require('express-model');
var domain = require('domain');
global.Models = models(__dirname + '/lib/models');
var aptLogic = require('./lib/logic/appoint');

global.rootPath = __dirname;

global.modelDomain = domain.create();
modelDomain.on('error',function(err){
    console.log('Data Model ERROR', err);
});


// 设定port变量，意为访问端口
app.set('port', 80);
app.set('ip', '0.0.0.0')
app.use(session({
        appId: 'your weixin app id',
        appSecret: 'your weixin app secret',
        loginPath: '/login',
        store: new FileStore(),
    }) 
)
app.use('/getHistory', function(request, response, next){
    var result = []
    for(var i=0; i<100; i++){
        reservation = {
            openId: request.session.userInfo.openId,
            history: 'history'+Math.random()
        }
        result[i] = reservation
    }
    setTimeout(function(){
        response.json(result)
    }, 1000)
    
})
app.use('/initUser', function(request, response, next){
    if(request.session){
        var userModel = global.Models.use('User');
        var user = request.session.userInfo;
        userModel.retrieve({open_id: user.openId}, function(result){
            if(result === undefined){
                console.log('用户不存在，开始新增');
                userModel.add(user, function(result){
                    if(result !== undefined){
                        response.json({
                            code: true,
                            desc: result.desc,
                            stuNo: result.stu_no,
                            realName: result.real_name
                        })
                    }
                    else{
                        response.json({
                            code: false,
                            msg: 'user add failed'
                        })
                    }
                })
            }
            else{
                response.json({
                    code: true,
                    desc: result.desc,
                    stuNo: result.stu_no,
                    realName: result.real_name
                })
            }
        })
    }else{
        response.json({code: false, msg: 'not login'})
    }
})
app.use('/loadHomeData', function(request, response, next){
    var result = []
    for(var i=0; i<10; i++){
        reservation = {
            startTime: 'startTime'+i,
            endTime: 'endTime'+i
        }
        result[i] = reservation
    }
    response.json(result)
})
app.use('/', function(request, response, next){
    aptLogic.retrieveApt({
        
    }, 
    {
        success: function(results){
            response.json(results)
        },
        fail: function(err){
            response.send(err)
        }
    })
})
app.listen(app.get('port'), app.get('ip'),function(err){
    if(err){
        console.log(err)
    } else{
        console.log('listen on:' + app.get('port'))
    }
});
