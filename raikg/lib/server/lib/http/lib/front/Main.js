/*
 * @author		Antonio Membrides Espinosa
 * @package    	Raikg Module Base
 * @created		26/10/2016
 * @updated		28/12/2016
 * @copyright  	Copyright (c)
 * @license    	GPL
 * @version    	1.0
 * */
class Front extends Raikg.Module.Base
{
    constructor(cfg = false, name=false, engine=false) {
        super(cfg, name, engine);
        this.engine.assist.get("ksike/bre").configure(this.engine.cfg);
    }

    analyze(request, response) {
        var url = require('url').parse(request.url).pathname;
        var www = this.engine.www();
        var rsc = www + url;
        console.log(rsc + " >> " + require('fs').existsSync(rsc));
        if (require('fs').existsSync(rsc)) {
            var sts = require('fs').statSync(rsc);
            if (sts.isDirectory()) {
                var file = this.getIndex(rsc);
                if (file) {
                    this.engine.evm.emit('onFileRequest', [file, request, response]);
                } else {
                    this.engine.evm.emit('onDirRequest', [rsc, request, response]);
                }
            } else {
                this.engine.evm.emit('onFileRequest', [rsc, request, response]);
            }
        }else{
            console.log("FRONT: NOT isDirectory");
            this.engine.evm.play('onRequest');
        }
    }

    onDirRequest(dir, request, response){
        var lst = require('fs').readdirSync(dir);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        var url = request.url.substr(-1) !== '/' ? request.url + '/' : request.url;
        response.write("<ul>");
        response.write('<li> <a href="' + url + "../" +'"  >..</a> </li>');
        for(var i in lst){
            var sts = require('fs').statSync(dir + lst[i]).isFile();
            response.write('<li> <a href="' +    url + lst[i] + (sts ? '' : '/' )   +'"  >'+lst[i]+'</a> </li>');
        }
        response.write("</ul>");
        response.end();
    }

    onFileRequest(file, request, response){
        this.handFile(file, response);
    }

    handFile(rsc, response){
        var extname = require('path').extname(rsc).substr(1);
        if(this.engine.cfg){
            if(this.engine.cfg.bind){
                if(this.engine.cfg.bind[extname]){
                    var bi = this.bin(extname);
                    var ps = this.engine.assist.get("ksike/ipc").start(bi, [rsc], false );
                    ps.stdout.pipe(response);
                    if(this.engine.logp){
                        //console.log(this.engine.logp + extname + ".log");
                        ps.stderr.pipe(require('fs').createWriteStream(this.engine.logp + extname + ".log"));
                    }
                }else{
                    this.sendFile(rsc, response);
                }
            }else{
                this.sendFile(rsc, response);
            }
        }
    }

    bin(extname){
        var bin = false;
        if(this.engine.cfg.bind[extname]){
            var opt = typeof (this.engine.cfg.bind[extname]) === 'string' ? [this.engine.cfg.bind[extname]] : this.engine.cfg.bind[extname];
            bin = this.engine.assist.get("ksike/bre").bin.apply(this.engine.assist.get("ksike/bre"), opt);
            if(!bin && opt[0] === "nodejs"){
                //console.log("NodeJs version: " + process.version.substr(1));
                return process.execPath;
            }
        }
        return bin;
    }

    sendFile(file, response) {
        var _this = this;
        this.engine.evm.stop("onRequest");
        var rs = require('fs').createReadStream(file);
        rs.on('error', function (error) {
            _this.engine.onError.apply(_this.engine, [error, _this.engine.rsc.request, _this.engine.rsc.response, _this.engine.assist]);
        });
        response.writeHead(200);
        rs.pipe(response);
        return rs;
    }

    getIndex(path) {
        path = (path.substr(-1) !== '/' && path.substr(-1) !== '\\') ? path + require('path').sep : path;
        for (var value of this.engine.cfg.index )
        {
            if (require('fs').existsSync(path + value))
                return path + value;
        }
        return false;
    }

    onStart() {
        console.log("start server at port: " + this.engine.server.address().port);
    }

    onRequest(request, response){
        if (this.engine.cfg["www"] != false
            && this.engine.cfg["www"] != ""
            && this.engine.cfg["www"] != null
            && this.engine.cfg["www"] != 0){
            this.engine.evm.pause('onRequest');
            this.analyze(request, response);
        }
    }

    onError(error, request, response, assist){
        this.engine.log({ 'name': error.name, 'message': error.message, 'file': error.fileName, 'line': error.lineNumber, 'stack': error.stack });
        if(response) response.end('Ups an error has occurred...');
        console.log(error);
    }
}
exports.Main = Front;