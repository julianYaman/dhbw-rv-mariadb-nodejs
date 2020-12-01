const mariadb = require('mariadb')
// Change the values below to your data
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'yaman',
    password: 'yaman!01',
    database: 'BuchDB'
})
module.exports={
    getConnection: function(){
        return new Promise(function(resolve,reject){
            pool.getConnection().then(function(connection){
                resolve(connection);
            }).catch(function(error){
                reject(error);
            });
        });
    }
}