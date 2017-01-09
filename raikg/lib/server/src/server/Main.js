/*
 * @author		Antonio Membrides Espinosa
 * @package    	Raikg Rhirno Server
 * @date		26/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Server
{
    constructor(opt=false) {
        require(__dirname + '/Module.js').Main;
        this.path = __dirname + "/../../";
        if(opt) this.configure(opt);
        this.logf = this.path + "../../log/server.log";
    }

    configure(opt=false) {
        this.cfg = opt ? opt : this.cfg;
        return this;
    }

    vh(path) {
        if(require('fs').existsSync(path)){
            var cfg = require('fs').readFileSync(path);
            var mtd = require('path').parse(path);
            try{
                cfg = JSON.parse(cfg);
                cfg['name'] = mtd['name'];
                return cfg;
            }catch (error){
                this.log("ERROR: Bat format on virtualhost: '" + path + "'");
            }
        }else{
            this.log("ERROR: no such virtualhost: '" + path + "'");
        }
        return false;
    }

    mod(vh, assist){
        var mod = assist.get("ksike/loader").get(this.path  + "lib/" + vh['mode']);
        mod.configure({ "cfg": vh, "rsc": { "process": process } });
        return mod;
    }

    start(req, assist) {
        var nm = req["REQUEST"][0] ? req["REQUEST"][0] : '';
        var vh = this.vh(nm);
        if(vh){
            this.mod(vh, assist).start(req, assist);
        }
    }

    log(data){
        data = typeof (data) === 'string' ? data : JSON.encode(data);
        require('fs').writeFileSync(this.logf, data);
    }
}
exports.Main = Server;