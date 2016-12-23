/*
 * @author		Antonio Membrides Espinosa
 * @package    	Raikg Rhirno Server
 * @date		26/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Raikg
{
    constructor(opt=false, process=false) {
        require(__dirname + '/Module.js').Main;
        this.http = require('http');
        this.cfg = { "port": 3003 };
        this.evt = new (require(__dirname + '/RkEvent.js').Main)();
        this.rsc = {
            "process": process,
            "request": false,
            "response": false
        };
        if(opt) this.configure(opt, process);
    }

    configure(opt=false, process=false) {
        opt = opt ? opt : this.cfg;
        if (opt.cfg.load) {
            var path = require('fs').existsSync(opt.cfg.path) ? opt.cfg.path : opt.root + opt.cfg.path;
            this.cfg = this.loadConfig(path);
            this.cfg.root = opt.root;
        }else this.cfg = opt;
        this.cfg.port = parseInt(this.cfg.port);
        this.rsc.process = process ? process : this.rsc.process;
        return this;
    }

    loadConfig(path) {
        var cfg = require('fs').readFileSync(path);
        return JSON.parse(cfg);
    }

    loadModules() {
        for(var i in this.cfg.modules){
            var module = __dirname + "/../../lib/" + this.cfg.modules[i]['name'];
            module = require('fs').existsSync(module) ?  module : this.cfg.modules[i]['name'];
            try {
                module = require(module);
            }catch (error){
                module = false;
                this.onError(error);
            }
            if(module){
                module = new (module.Main)(
                    this.cfg.modules[i]['cfg'],
                    this.cfg.modules[i]['name'],
                    this
                );
                this.evt.add(module, module.name);
            }
        }
    }

    start() {
        this.loadModules();
        var _this = this;
        this.http.createServer(function (request, response) {
            _this.server = this;
            _this.onRequest.apply(_this, arguments);
        }).listen(this.cfg.port, function () {
            _this.server = this;
            _this.onStart.apply(_this, arguments);
        });
    }

    stop(){
        var _this = this;
        this.http.close(function () {
            _this.onStop.apply(_this, arguments);
        });
    }

    onStart() {
        this.evt.emit('onStart', arguments);
    }

    onStop() {
        this.evt.emit('onStart', arguments);
    }

    onRequest(request, response) {
        this.rsc.response = response;
        this.rsc.request = request;
        if(request.method.toLowerCase() == "post"){
            var _this = this;
            var data = '';
            request.on('data', function(chunk) {
                data += chunk.toString();
            });
            request.on('end', function() {
                _this.rsc.request.krs = { post: require('querystring').parse(data) };
                _this.evt.emit('onPreRequest', [_this.rsc.request, response]);
                _this.evt.emit('onRequest', [_this.rsc.request, response]);
                _this.evt.emit('onPosRequest', [_this.rsc.request, response]);
            });
        }else{
            this.evt.emit('onPreRequest', arguments);
            this.evt.emit('onRequest', arguments);
            this.evt.emit('onPosRequest', arguments);
        }
    }

    onError(error) {
        this.evt.emit('onError', arguments);
    }
}
exports.Main = Raikg;