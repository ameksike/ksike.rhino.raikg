/*
 * @author		Antonio Membrides Espinosa
 * @package    	Ksike Rhino Config
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Main
{
    constructor(){
        this.last = false;
        this.cache = [];
    }

    read(path) {
        if(!require('fs').existsSync(path)) return {};
        this.last = path;
        var cfg = require('fs').readFileSync(path);
        return JSON.parse(cfg);
    }
    write(data, path){
        try{
            require('fs').writeFileSync(path, JSON.stringify(data));
        }
        catch (error){
            return false;
        }
        return true;
    }

    get(path=false, index="config", force=false){
        var key = path;
        path = this.resolve(path, index);
        if(!path) return false;
        if(!this.cache[path]){
            this.cache[path] = {};
            force = true;
        }
        if(force){
            this.cache[path][index] = this.read(path);
            var tmp = this.get("root");
            if(tmp[key]) this.cache[path][index] = Object.assign(this.cache[path][index], tmp[key]);
        }
        return this.cache[path][index];
    }
    save(path=false, index="config", data=false){
        var tmp = path ? this.assist.get("ksike/router").path(path) : false;
        path = this.resolve(path, index);
        data = data ? data : this.get(path, index);
        if(!path) return false;
        this.write(data, path);
    }

    resolve(path=false, index="config"){
        if(require('fs').existsSync(path)) return path;
        path = path ? this.assist.get("ksike/router").path(path) : false;
        if(!path) return this.last;
        return path + "cfg/" + index + ".json";
    }
}
exports.Main = Main;