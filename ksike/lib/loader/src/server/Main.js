/*
 * @author		Antonio Membrides Espinosa
 * @package    	Ksike Rhino Loader
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Main
{
    constructor(cfg=false){
        this.lib = {};
        this.drv = {};
        this.cfg = {};
        this.configure(cfg);
    }

    configure(cfg=false){
        this.cfg = cfg ? cfg : this.cfg;
    }

    driver(name="module"){
        if(!this.drv[name]){
            var file = __dirname +  "/../../lib/" + name.toLowerCase();
            this.drv[name] = require(file);
            this.drv[name] = this.drv[name]["Main"] ? this.drv[name]["Main"] : this.drv[name]
            this.drv[name] = new this.drv[name](this.cfg);
            this.drv[name]["assist"] = this.lib["ksike"];
        }
        return this.drv[name];
    }

    resolve(target, params=false){
        //console.log(" ----------resolve << " + target);

        if (typeof (target) === "string") {
            target = { "pattern": target, "type": "module" };
        }
        if(target){
            target.param = target.param ? target.param : params;
            if(!this.driver(target.type)) target.type = "module";
            return this.driver(target.type).configure(this.cfg).resolve(target);
        }
        return false;
    }

    get(module, params=false){
        if(!this.lib[module])
            this.lib[module] = this.resolve(module, params);
        return this.lib[module];
    }

    new(module, params=false){
        return this.resolve(module, params);
    }
}
exports.Main = Main;