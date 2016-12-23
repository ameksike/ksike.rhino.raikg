/*
 * @author		Antonio Membrides Espinosa
 * @package    	Raikg Module Base
 * @date		26/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class RkLpsf extends Raikg.Module.Base
{
    publicStaticFiles(request, response) {
        var _this = this;
        var url = require('url').parse(request.url).pathname;
        var www = (typeof (this.engine.cfg.www) === "string") ? this.engine.cfg.www : this.engine.cfg.www[require('os').platform()];
        var file = www + url;
        console.log(file + " >> " + require('fs').existsSync(file));
        if (require('fs').existsSync(file)) {
            require('fs').stat(file, function (error, stat) {
               if (error) {
                    _this.engine.onError.apply(_this.engine, arguments);
                }
                if (stat.isDirectory()) {
                    var ifile = _this.getIndex(file);
                    if (ifile) {
                        _this.sendFile(ifile, response);
                    } else {
                       _this.engine.evt.emit('onDirRequest', [file, request, response]);
                    }
                } else {
                   _this.sendFile(file, response);
                }
            });
        }else{
            _this.engine.evt.play('onRequest');
        }
    }

    getIndex(path) {
        for (var value of this.engine.cfg.index )
        {
            if (require('fs').existsSync(path + value))
                return path + value;
        }
        return false;
    }

    sendFile(file, response) {
        var _this = this;
        this.engine.evt.stop();
        var rs = require('fs').createReadStream(file);
        rs.on('error', function (error) {
           _this.engine.onError.apply(_this.engine, arguments);
        });
        response.writeHead(200);
        rs.pipe(response);
        return rs;
    }

    onStart() {
        console.log("onStart at port: " + this.engine.server.address().port);
    }

    onRequest(request, response){
        if (this.engine.cfg["www"] != false
            && this.engine.cfg["www"] != ""
            && this.engine.cfg["www"] != null
            && this.engine.cfg["www"] != 0){
            this.engine.evt.stop('onRequest');
            this.publicStaticFiles(request, response);
        }
    }
}
exports.Main = RkLpsf;