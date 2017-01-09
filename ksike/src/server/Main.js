/*
 * @author		Antonio Membrides Espinosa
 * @package    	Ksike Rhino Framework
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Main
{
    constructor(cfg=false){
        this.cfg = {};
        this.rsc = { "process": process } ;
        this.path = __dirname + "/../../";
        this.loader = this.build(this.path + "lib/loader/");
        this.loader.lib["ksike"] = this;
        this.loader.lib["ksike/loader"] = this.loader;
        this.loader.lib["ksike/router"] = this.build(this.path + "lib/router/");
        this.loader.get("ksike/router").nsmin = this.build(this.path + "lib/nsmin/");
        this.loader.get("ksike/router").configure({
            "mode": ["equal", "first", "finds"],
            "path": {
                "root": this.path,
                "scope": [ "lib/" ],
                "domain": [ "src/server/" ],
                "index": [ "Main.js" ]
            },
            "locate":{ "pattern": { "ksike": { path:"" } } }
        });
        this.get("ksike/router").cache["ksike"] = { dir: this.path };
        this.get("ksike/router").cache["root"]  = { dir: this.path };
        this.configure(cfg);
    }

    configure(opt=false){
        this.rsc = opt.rsc ? opt.rsc : this.rsc;
        this.path = opt.path ? opt.path : this.path;
        if(opt.cfg){
            if (opt.cfg.load) {
                this.cfg = this.get("ksike/config").get(this.loader.get("ksike/router").normalize(opt.cfg.path, opt.root));
                this.cfg = this.cfg.ksike ? this.cfg.ksike : this.cfg;
            }else this.cfg = opt.cfg;
            if(this.cfg.router){
                this.cfg.router.path.root = this.cfg.router.path.root !== "" ? this.cfg.router.path.root : opt.root ;
                this.get("ksike/router").configure(this.cfg.router);
                this.get("ksike/router").cache["root"]  = { dir: this.cfg.router.path.root };
            }
        }
        return this;
    }

    dispatch(){
        this.get("ksike/engine").assist = this;
        return this.get("ksike/engine").configure(this.cfg.engine).process();
    }

    build(path, param=false){
        return new (require(path).Main)(param);
    }

    get(module, param=false){
        return this.loader.get(module, param);
    }

    new(module, param=false){
        return this.loader.new(module, param);
    }
}
exports.Main = Main;