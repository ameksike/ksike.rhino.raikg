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
 * @require:        NodeJs >= 6.9.1, Tedious
 */
class DrSQLSRV
{
    constructor(opt=false){
        this.cfg = {};
        this.connection = false;
        this.rsc = {
            "Connection": require('tedious').Connection,
            "Request": require('tedious').Request
        }
        this.configure(opt);
    }

    configure(opt=false){
        this.cfg = opt ? opt : this.cfg;
        this.cfg.host = this.cfg.host ? this.cfg.host : "localhost";
        this.cfg.user = this.cfg.user ? this.cfg.user : "sa";
        this.cfg.pass = this.cfg.pass ? this.cfg.pass : "";
        this.cfg.encrypt = this.cfg.encrypt ? this.cfg.encrypt : false;
        this.cfg.log = this.cfg.log ? this.cfg.log : __dirname + "/../../log/";
        return this;
    }

    connect(callback=false, score=false){
        var _this = this;
        this.connection = new this.rsc.Connection(this.dsn());
        this.connection.on('connect', function (error) {
            score = score ? score : _this;
            if(callback) callback.call(score, error);
        });
        return this;
    }

    disconnect(){
        this.connection.close();
        return this;
    }

    query($sql=false, callback=false, score=false) {
        if($sql){
            var _this = this;
            var rows = [];
            this.connect(function(error){
                if(error)  _this.onError(error);
                else{
                    var request = new this.rsc.Request($sql, function (error, rowCount) {
                        if (error) {
                            _this.onError(error);
                        } else {
                            score = score ? score : _this;
                            if(callback) return callback.call(score, rows);
                        }
                        _this.disconnect();
                    });
                    request.on('row', function (columns) {
                        var row = {};
                        columns.forEach(function (column) {
                            row[column.metadata.colName] = column.value;
                        });
                        rows.push(row);
                    });
                    _this.connection.execSql(request);
                }
            }, this);
            return true;
        }else return false;
    }

    onError(error){
        console.log(error);
    }

    dsn(){
        return {
            server: this.cfg.host,
            userName: this.cfg.user,
            password: this.cfg.pass,
            "options": {
                "database": this.cfg.name,
            },
            encrypt: this.cfg.encrypt //... for Azure users
        }
    }
}
exports.Main = DrSQLSRV;