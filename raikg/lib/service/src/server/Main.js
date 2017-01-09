/*
 * @author		Antonio Membrides Espinosa
 * @package    	Raikg Service
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c)
 * @license    	GPL
 * @version    	1.0
 * */
class Main {
    constructor(assist) {
        this.cache = { };
        console.log(assist.get("ksike/config").get("root").raikg.virtualhost);
        console.log(assist.get("ksike/router").path("root"));
        this.path = assist.get("ksike/router").normalize(assist.get("ksike/config").get("root").raikg.virtualhost);
    }

    srvRe(){
        return this.assist.get("ksike/bre").bin("nodejs");
    }
    srvReload(assist){
        this.cache =  assist.get("ksike/config").get("raikg/service", "cache");
    }
    srvStart(name, assist){
        this.srvReload(assist);
        if(! assist.get("ksike/ipc").status(this.cache[name]) ){
            var vhf = require('fs').existsSync(this.path + name + ".json" ) ?  this.path + name + ".json"  : this.path + name;
			
            var pss = assist.get("ksike/ipc").start(this.srvRe(), [assist.get("ksike/router").path("root")+"bin/cli.js", "raikg:server:start", vhf]);
            this.cache[name] = pss.pid;
        }
    }
    srvStop(name, assist){
        this.srvReload(assist);
        if(this.cache[name])
            return assist.get("ksike/ipc").stop(this.cache[name]);
        return false;
    }
    srvStatus(name, assist){
        this.srvReload(assist);
        var vhf = require('fs').existsSync(this.path + name + ".json" ) ?  this.path + name + ".json"  : this.path + name;
        if(!require('fs').existsSync(vhf)) return false;
        var sts = assist.get("ksike/ipc").status(this.cache[name]);
        var tmp = assist.get("ksike/config").get(vhf);
        tmp["active"]  = sts;
        tmp["pid"] = this.cache[name];
        return tmp;
    }

    start(req, assist){
		console.log('-----start-----------------');
        req["REQUEST"] = req["REQUEST"].length === 0 ? ["default"] : req["REQUEST"];
        for(var i in req["REQUEST"]){
			console.log('----------------------'+i);
			console.log('----------------------'+req["REQUEST"][i]);
            this.srvStart(req["REQUEST"][i], assist);
        }
        assist.get("ksike/config").save("raikg/service", "cache", this.cache);
        return true;
    }
    stop(req, assist){
        var out = {};
        req["REQUEST"] = req["REQUEST"].length === 0 ? ["default"] : req["REQUEST"];
        for(var i in req["REQUEST"]){
            out[req["REQUEST"][i]] = this.srvStop(req["REQUEST"][i], assist);
        }
        return out;
    }
    restart(req, assist){
        this.stop(req, assist);
        this.start(req, assist);
        return true;
    }
    status(req, assist){
        var out = {};
        req["REQUEST"] = req["REQUEST"].length === 0 ? ["default"] : req["REQUEST"];
        for(var i in req["REQUEST"]){
            out[req["REQUEST"][i]] = this.srvStatus(req["REQUEST"][i], assist);
        }
        return out;
    }
    list(req, assist){
        var out = [];
        var list = require("fs").readdirSync(this.path);
        for(var i in list){
            out.push(list[i].replace(".json", "")) ;
        }
        return out;
    }
}
exports.Main = Main;