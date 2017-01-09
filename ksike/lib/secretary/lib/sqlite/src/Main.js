/*
 * @description:    This is simple and light lib for manage DBSM
 * @framework:      Ksike Rhino
 * @package:        Secretary
 * @version:        0.1
 * @authors:        Antonio Membrides Espinosa
 * @mail:           ameksike@gmail.com
 * @created:        04/11/2016
 * @updated:        04/11/2016
 * @license:        GPL v3
 * @copyright  	    Copyright (c) 2015-2015
 * @require:        NodeJs >= 6.9.1, Sqlite3
 */
class DrSQLITE
{
    constructor(opt=false){
        this.cfg = {
			extension: "db"
		};
        this.connection = false;
        this.rsc = {
            "Sqlite": require('sqlite3').verbose()
        }
        this.configure(opt);
    }

    configure(opt=false){
		for(var i in opt) this.cfg[i] = opt[i];
        this.cfg.log = this.cfg.log ? this.cfg.log : __dirname + "/../../log/";
        return this;
    }

    connect(callback=false, score=false){
        this.connection = new this.rsc.Sqlite.Database(this.dsn())
        return this;
    }
    disconnect(){
        this.connection.close();
        return this;
    }
    query(sql=false, callback=false, score=false) {
        var _this = this;
        this.connect();
        if(typeof (sql) === "string"){
            if(!sql.match("SELECT|select")) {
                this.connection.serialize(function(){ _this.connection.run(sql); });
                score = score ? score : _this;
                if(callback) return callback.call(score);
            }else{
                this.connection.all(sql, function(error, rows) {
                    if(error){
                        _this.onError(error);
                    }else{
                        score = score ? score : _this;
                        if(callback) return callback.call(score, rows);
                    }
                });
            }
        }else{
            this.connection.serialize(function(){
                var query = _this.connection.prepare(sql[0]);
                query.run.apply(query, sql[1]);
                query.finalize();
            });
            score = score ? score : _this;
            if(callback) return callback.call(score);
        }
        this.disconnect();
    }

    onError(error){
        console.log(error);
    }

    dsn(){
		if(this.cfg.path == ':memory:') return this.cfg.path;
		if(require('fs').existsSync(this.cfg.name))
			return this.cfg.name;
		if(require('fs').existsSync(this.cfg.path + this.cfg.name))
			return this.cfg.path + this.cfg.name;
		if(require('fs').existsSync(this.cfg.path + this.cfg.name + "." + this.cfg.extension))
			return this.cfg.path + this.cfg.name + "." + this.cfg.extension;
		return ':memory:';
    }
}
exports.Main = DrSQLITE;
