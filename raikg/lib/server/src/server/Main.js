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
    }

    configure(opt=false) {
        this.cfg = opt ? opt : this.cfg;
        return this;
    }

    vh(path) {
        var cfg = require('fs').readFileSync(path);
        return JSON.parse(cfg);
    }

    mod(vh, assist){
        var mod = assist.get("ksike/loader").get(this.path  + "lib/" + vh['mode']);
        mod.configure({ "cfg": vh, "rsc": { "process": process } });
        return mod;
    }

    start(req, assist) {
        var vh = this.vh(req["REQUEST"][0]);
        this.mod(vh, assist).start(req, assist);
    }
}
exports.Main = Server;