/*
 * @author		Antonio Membrides Espinosa
 * @package    	Ksike Rhino Base Run Environment
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Main
{
    onConfigure(assist){
        this.assist = assist;
        this.root = this.assist.get("ksike/router").path("root");
        if(assist.cfg.bre){
            if(assist.cfg.bre.nodejs){
                this.setNodePath(assist.cfg.router.path.root + assist.cfg.bre.nodejs.modules);
            }
            if(assist.cfg.bre.vendor){
                for(var i in assist.cfg.bre.vendor)
                    assist.get(assist.cfg.bre.vendor[i]);
            }
            this.root = require('fs').existsSync(assist.cfg.bre.bin) ?
                this.root = require('path').resolve(assist.cfg.bre.bin) + this.sd() :
                this.root + assist.cfg.bre.bin;
        }
        this.cfg = { bins : false };
    }

    configure(opt){
        this.cfg = opt ? opt : false;
    }

    setNodePath(path, env=false){
        env = env ? env : process.env;
        env.NODE_PATH = path;
        require('module').Module._initPaths();
        return this;
    }
    architecture(){
        //... 'arm', 'x86', 'x64'
        return this.assist.rsc.process.arch ===  'ia32' ? "x86" : this.assist.rsc.process.arch;
    }
    platform(){
        //... 'darwin', 'freebsd', 'linux', 'sunos', 'windows'
        return this.assist.rsc.process.platform === "win32" ? "windows" : this.assist.rsc.process.platform;
    }
    memory(){
        return this.assist.rsc.process.memoryUsage();
    }
    mode(){
        //... 'http', 'cli'
        return this.assist.rsc.request ? "http" : "cli";
    }
    sd(){
        //...  separator directory or segment separator:   linux => \ , windows => /
        return require('path').sep;
    }
    sp(){
        //...  separator path or path delimiter:   linux => : , windows => ;
        return require('path').delimiter;
    }
    sl(){
        //...  shared lib:   linux => so, windows => dll
        switch (this.platform()){
            case "windows": return "dll"; break;
            case "linux": return "so"; break;
            default: return false; break;
        }
    }
    se(){
        //... script excecutor o bash script: linux => sh, windows => bat
        switch (this.platform()){
            case "windows": return "bat"; break;
            case "linux": return "sh"; break;
            default: return ""; break;
        }
    }
    be(){
        //... bin excecutor: linux => , windows => .exe
        switch (this.platform()){
            case "windows": return ".exe"; break;
            default: return ""; break;
        }
    }

    exist(){
        var tmp = this.cfg.bins;
        for(var i in arguments){
            if(typeof (tmp[arguments[i]]) === 'undefined') return false;
            tmp = tmp[arguments[i]];
        }
        return tmp;
    }
    link(path){
        if(require('fs').existsSync(path)) return path;
        if(require('fs').existsSync(this.root + path)) return this.root + path;
        return false;
    }

    bin(name, version=false, nbin=false, architecture=false, platform=false){
        if(!this.cfg.bins) return this.find(name, version, nbin, architecture, platform);
        nbin = nbin ? nbin : ( this.exist(name, "default", 'name') ? this.exist(name, "default", 'name') : name );
        version = version ? version : ( this.exist(name, "default", 'version') ? this.exist(name, "default", 'version') : "1.0" );
        architecture = architecture ? architecture : ( this.exist(name, "default", 'architecture') ? this.exist(name, "default", 'architecture') : this.architecture() );
        platform = platform ? platform : ( this.exist(name, "default", 'platform') ? this.exist(name, "default", 'platform') : this.platform() );
        var tmp = this.link( this.exist(name, version, architecture, platform));
        return tmp ? tmp :  this.link( this.exist(name, version, 'x86', platform)) ;
    }

    find(name, version=false, nbin=false, architecture=false, platform=false){
        nbin = nbin ? nbin : name;
        if((name === "nodejs" || name === "node") && !version){
            console.log("NodeJs version: " + process.version.substr(1));
            return process.execPath;
        }
        version = version ? version : '1.0.0';
        if(architecture && platform){
            var tmp = this.assist.get("ksike/router").normalize(name  + this.sd() + version +  this.sd() + architecture + this.sd() +  platform +  this.sd() + nbin  + this.be());
            if(tmp) return tmp;
        }
        tmp = this.root + name  + this.sd() + version +  this.sd() + this.architecture() + this.sd() +  this.platform() +  this.sd() + nbin + this.be();
        if(require('fs').existsSync(tmp)) return tmp;
        tmp = this.root + name  + this.sd() + version +  this.sd() + this.architecture() + this.sd() +  this.platform() +  this.sd()+"bin"+  this.sd() + nbin + this.be();
        if(require('fs').existsSync(tmp)) return tmp;
        tmp = this.root + name  + this.sd() + version +  this.sd() + "x86" + this.sd() +  this.platform() +  this.sd() + nbin  + this.be();
        if(require('fs').existsSync(tmp)) return tmp;
        tmp = this.root + name  + this.sd() + version +  this.sd() + "x86" + this.sd() +  this.platform()+  this.sd()+"bin" +  this.sd() + nbin  + this.be();
        return tmp;
    }
}
exports.Main = Main;