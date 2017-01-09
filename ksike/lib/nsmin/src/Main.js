/*
 * @author		Antonio Membrides Espinosa
 * @package    	KsRhino Nsmin
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Main
{
    constructor(cfg=false){
        this.cfg = {
            mode: ["equal", "first", "finds"],
            pats: {},
            defs: {}
        };
        this.configure(cfg);
    }

    configure(cfg=false){
        if(cfg){
            this.cfg.mode = cfg.mode ? cfg.mode : this.cfg.mode;
            this.cfg.pats = cfg.pattern ? cfg.pattern : this.cfg.pats;
            this.cfg.defs = cfg.default ? cfg.default : {};
        }
        return this;
    }

    equal(req){
        if(this.cfg.pats[req.pattern]){
            req.namespace = req.pattern ;
            return this.merge(req, this.format(this.cfg.pats[req.pattern])) ;
        }return false;
    }

    first(req){
        var pats = req.pattern.split("/");
        var i = pats[0] === "/" ? 1 : 0;
        if(this.cfg.pats[pats[i]]){
            req.namespace = pats[i] + "/";
            return this.merge(req, this.format(this.cfg.pats[pats[i]])) ;
        }return false;
    }

    finds(req){
        for(var i in this.cfg.pats){
            var rsc = req.pattern.match(new RegExp("^"+i, "m"));
            if(rsc){
                req.pattern = req.pattern.replace(i+"/", "/");
                req = this.merge(req, this.cfg.pats[i]);
                if(req.action){
                    req.pattern = "/" + req.action + req.pattern;
                }
                if(req.controller){
                    req.pattern = "/" + req.controller + req.pattern;
                }
                return req;
            }
        }
        return false;
    }

    format(req){
        if(typeof (req) !== "object" ){
            this.cfg.defs.key = this.cfg.defs.key ? this.cfg.defs.key : "path";
            this.cfg.defs[this.cfg.defs.key] = req;
            return this.cfg.defs;
        }
        return req;
    }

    resolve(pattern){
        var _this = this;
        var _reqs = typeof(pattern) === "object" ? pattern : {
            "pattern": pattern
        };
        var out = false;
        for(var i in this.cfg.mode){
            out = (_this[this.cfg.mode[i]]) ? _this[this.cfg.mode[i]].call(this, _reqs) : false;
            if(out){
                if(out.pattern) {
                    out.name = out.name ? out.name : out.pattern.replace(out.namespace, "");
                }return out;
            }
        }
        return out;
    }

    merge (_this, obj) {
        if(Object.assign) return Object.assign(_this, obj);
        for(var i in obj)
            _this[i] = obj[i];
        return _this;
    }
}
exports.Main = Main;