/*
 * @author		Antonio Membrides Espinosa
 * @package    	Ksike Rhino Loader
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class DrMODULE
{
    constructor(cfg = false) {
        this.cfg = {};
        this.cache = {};
        this.configure(cfg);
    }

    configure(cfg=false){
        this.cfg = cfg ? cfg : this.cfg;
        return this;
    }

    build(_class=false, _param=false, _index=false ){
        if(_class){
            try{
               _class = (typeof (_class[_index]) === "function") ? _class[_index] : _class;
               if(typeof(_class) !== "function") return _class;
                _param = _param instanceof Array ? _param : [_param];
               return Reflect.construct(_class, _param);
               //return (typeof (_class[_index]) === "function") ? new _class[_index](_param) :  (typeof(_class) === "function" ? new _class(_param) : _class) ;
            }
            catch (error){
                this.assist.get("ksike/event").emit("onError", [this.assist, error]);
                return false;
            }
        }
    }

    load(file){
        if(require('fs').existsSync(file)){
            return require(file);
        }
        return false;
    }
    
    resolve(opt){


        opt.type = "locate";
        try{
            var rsc  = require(opt.pattern);
            opt.param = opt.param ? opt.param : false;
            opt.ns =  opt.ns ? opt.ns : "Main";
            var tmp = this.build(rsc, opt.param, opt.ns);
            tmp.assist = this.assist;
            return tmp;
        }
        catch (error){
            opt = this.assist.get("ksike/router").resolve(opt);
            if(opt.file){
                var rsc  = this.load(opt.file);
                if(!rsc) return false;
                opt.param = opt.param ? opt.param : false;
                opt.ns =  opt.ns ? opt.ns : "Main";
                var tmp = this.build(rsc, opt.param, opt.ns);
                tmp.assist = this.assist;
                return tmp;
            }else return false;
        }
    }
}
exports.Main = DrMODULE;