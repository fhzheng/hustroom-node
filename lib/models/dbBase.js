var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
var dbBase = {
    dbFile : global.rootPath + '/data/db1.db',
    getDb: function(){
        return new this.db.Database(this.dbFile, 2, modelDomain.bind(err => {
            if(err){
                throw err
            }
            else{
                console.log('打开成功');
            }
        }))
    },
    db: null,
    getTscDb: function(){
        return new TransactionDatabase(this.getDb());
    }
}

module.exports = dbBase