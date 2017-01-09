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
 * @require:        NodeJs >= 6.9.1
 */
class Main
{
    constructor(opt=false){
        this.cfg = { driver: "sqlite" };
        this.drs = {};
        if(opt) this.configure(opt);
    }

    configure(opt=false) {
        this.cfg = opt ? opt : this.cfg;
        this.cfg.driver = this.cfg.driver ? this.cfg.driver : "sqlite";
        if(this.get()) this.get().configure(opt);
        return this;
    }

    get(driver=false) {
        driver = driver ? driver : this.cfg.driver;
        if(driver){
            if(this.drs[driver]) return this.drs[driver];
            var file = __dirname +  "/../../lib/" + driver.toLowerCase();
            if(!require('fs').existsSync(file))  return false;
            var Class = require(file);
            Class = Class.Main ?  Class.Main : Class;
            this.drs[driver] = new Class(this.cfg);
            return this.drs[driver];
        }else return false;
    }

    //... interface functions

    query($sql=false, callback=false, score=false) {
        return this.get().query($sql, callback, score);
    }

    execute($sql=false, callback=false, score=false){
        console.log(this);
        return this.get().query($sql, callback, score);
    }

    connect(callback=false, score=false) {
        return this.get().connect(callback, score);
    }

    disconnect() {
        return this.get().disconnect();
    }

    dsn(){
        return this.get().dsn();
    }
}
exports.Main = Main;