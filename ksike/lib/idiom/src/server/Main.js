/*
 * @author		Antonio Membrides Espinosa
 * @package    	Ksike Rhino Idiom
 * @created		26/11/2016
 * @updated		26/11/2016
 * @copyright  	Copyright (c) 2015-2020
 * @license    	GPL v3.0
 * @version    	1.0
 * */
class Main
{
    constructor(){
        this.last = false;
        this.cache = [];
    }

    index(req, assist){
        return req;
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

    get(path=false, index=false, force=false){
        path = this.resolve(path, index);
        if(!path) return false;
        if(!this.cache[path]){
            this.cache[path] = {};
            force = true;
        }
        if(force) this.cache[path][index] = this.read(path);
        return this.cache[path][index];
    }

    save(path=false, index=false, data=false){
        var tmp = path ? this.assist.get("ksike/router").path(path) : false;
        path = this.resolve(path, index);
        data = data ? data : this.get(path, index);
        if(!path) return false;
        this.write(data, path);
    }

    resolve(path=false, index=false){
        if(!index){
            this.default = this.assist.get("ksike/config").get("ksike").idiom.default;
            index = this.default;
        }
        if(require('fs').existsSync(path)) return path;
        path = path ? this.assist.get("ksike/router").path(path) : false;
        if(!path) return this.last;
        return path + "idm/" + index + ".json";
    }
}
exports.Main = Main;