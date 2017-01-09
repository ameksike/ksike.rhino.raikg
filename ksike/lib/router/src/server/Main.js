/*
 * @author		Antonio Membrides Espinosa
 * @package    	KsRhino Router
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
            "mode": ["locate", "find", "extract"]
        };
        this.cache = {};
        this.nsmin = false;
        this.configure(cfg);
    }

    configure(cfg=false){
        this.cfg = cfg ? cfg : this.cfg;
        return this;
    }

    resolve(req, type=false){
        if(!this.nsmin) return false;
        req = typeof (req) === "string" ? { pattern: req } : req;
        if(req){
            req.type = type ? type : (req.type ? req.type : "locate") ;
            var key = req.pattern ? req.pattern : "default";
            if(!this.cache[key]) {
                this.nsmin.configure(this.cfg[req.type]);
                var tmp = this.nsmin.resolve(req);
                tmp = tmp ? tmp : req;
                tmp.path = tmp.path === '.' ? this.path('root') : tmp.path;
                this.cache[key] = this[tmp.type] ? this[tmp.type](tmp, this.cfg[req.type]["default"]) : tmp;
            }
            return this.cache[key];
        }
        return false;
    }

    path(pattern){
        var tmp = this.resolve(pattern, "locate");
        return tmp["dir"] ? require('path').resolve(tmp["dir"]) + require('path').sep : false;
    }

    normalize(path, root=false){
        var tmp = require('path').resolve(path);
        if(require('fs').existsSync(tmp))
            return require('fs').statSync(tmp).isDirectory() ?  tmp + require('path').sep : tmp;
        tmp = require('path').resolve((root ? root : this.path("root")) + path);
        return (require('fs').existsSync(tmp)) ?
            ( require('fs').statSync(tmp).isDirectory() ?  tmp + require('path').sep : tmp )  : false;
    }

    request(req, _default={}){
        if(!req.controller || !req.action){
            req.param = req.param ? req.param : { URL: [] };
            req.param.URL = req.param.URL ? req.param.URL : [];
            var controller = req.pattern.split("/");
            if(controller.length > 2){
                req.controller = controller[1]!=="" ? controller[1] : _default.controller;
                req.action = controller[2]!=="" ? controller[2] :  _default.action;
                if(controller.length > 3){
                    for(var i=3; i<controller.length; i++)
                        req.param.URL.push(controller[i]);
                }
            }else{
                req.action = controller[controller.length == 1 ? 0 : 1]!=="" ? controller[controller.length == 1 ? 0 : 1] : _default.action;
                req.controller = _default.controller;
            }
        }
        req.name = !req.name ? req.controller : req.name;
        req.controller = req.namespace ? req.namespace + req.controller : req.controller;
        return this.requestFill(req);
    }

    requestFill(req){
        if(req.param){
            req.param.REQUEST =  req.param.REQUEST ?  req.param.REQUEST : {};
            for(var i in req.param){
                if(i !== "REQUEST" && i !== "CLI" && i !== "URL" ){
                    for(var j in req.param[i])
                        req.param.REQUEST[j] = req.param[i][j];
                }
                if(i !== "REQUEST" && (i == "URL" || i == "CLI")){
                    for(var j in req.param[i])
                        req.param.REQUEST.push(req.param[i][j]);
                }
            }
        }
        return req;
    }

    locate(req, _default={}){
        req.dir = req.path!==undefined ? req.path  :  ""; //req.pattern.replace(req.namespace, req.path) !==""
        req.index = req.index ? req.index : false;
        req.name = req.name ? req.name : (req.namespace ? "" : req.pattern );
        req.dir = this.scope(req.dir, req.name);
        req.dir = req.dir ? require('path').resolve(req.dir) + require('path').sep : false;
        req.file = this.domain(req.dir, req.index);
        req.file = req.file ? require('path').resolve(req.file) : false ;
        return req;
    }

    index(path){
        for(var i in this.cfg.path.index){
            if(require('fs').existsSync(path + this.cfg.path.index[i] )){
                return path + this.cfg.path.index[i];
            }
        }
        return false;
    }

    domain(path, index=false){
        if(require('fs').existsSync(path + index ))
            return path + index;
        for(var i in this.cfg.path.domain){
            var rsc = false;
            if(index){
                rsc = require('fs').existsSync( path + this.cfg.path.domain[i] + index ) ? path + this.cfg.path.domain[i] + index : false;
            }else{
                rsc = this.index(path + this.cfg.path.domain[i]);
            }
            if(rsc) return rsc;
        }
        return false;
    }

    scope(path, index=""){
        var tmp = this.normalize(path + index);
        if(tmp) return tmp;
        for(var i in this.cfg.path.scope){
            tmp = this.normalize(path + this.cfg.path.scope[i] + index);
            if(tmp) return tmp;
        }
        return false;
    }
}
exports.Main = Main;