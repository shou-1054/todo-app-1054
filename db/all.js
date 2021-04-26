exports.getAllRows = function(sql) {
    let sqlite3 = require('sqlite3').verbose(); //sqlite3オブジェクトの取り出し,verboseメソッドで取り出す
    let db = new sqlite3.Database("todo.db"); //Databeseオブジェクトの作成,使用するデータベースファイルの指定
    
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            resolve(rows);
        });
    });
}