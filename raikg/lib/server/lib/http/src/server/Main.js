/*
 * @author		Antonio Membrides Espinosa
 * @package    	Raikg Rhirno HTTP Server
 * @created		26/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c)
 * @license    	GPL
 * @version    	1.0
 * */
class Ler
{
    get(signal, value, index=0, scope=0){
        switch(typeof (value)){
            case 'array':
            case 'object':
                return {
                    "signal": value["signal"] ? value["signal"] : signal,
                    "scope": value["scope"]  ? value["scope"]  : scope,
                    "target": value["target"] ? this.engine.assist.get(
                        __dirname + "/../../lib/" + value["target"],
                        [ value["cfg"], value["target"], this.engine]
                    ) : false
                };
                break;
            case 'string':
                return { "target": this.engine.assist.get("ksike/loader").get(
                    __dirname + "/../../lib/" + value,
                    [ {}, value, this.engine]
                ), "signal": signal,  "scope": scope};
                break;
            default: return { "target": value, "signal": signal,  "scope": scope}; break;
        }
    }
}
class Main
{
    constructor(opt) {
        this.http = require('http');
        this.cfg = { "port": 3003 };
        this.evm = false;
        this.rsc = {
            "process": process,
            "request": false,
            "response": false
        };
        if(opt) this.configure(opt, process);
    }

    configure(opt) {
        if(!opt) return this;
        this.cfg = opt.cfg ? opt.cfg : this.cfg;
        this.cfg.port = parseInt(this.cfg.port);
        this.rsc.process = opt.rsc ? (opt.rsc.process ? opt.rsc.process : this.rsc.process) : this.rsc.process;
        if(this.cfg.mods){
            var req = new Ler();
            req.engine = this;
            this.evm = this.assist.new("ksike/event").configure( {"evs": this.cfg['mods'], "req": req} );
        }
        this.logp = this.cfg.log ? this.assist.get("ksike/router").normalize(this.cfg.log) : this.path + "../../log/";
        this.evm.emit('onConfigure', [this, this.assist]);
        return this;
    }

    www(){
        var platform = require('os').platform() == "win32" ? "windows" : require('os').platform();
        return (typeof (this.cfg.www) === "string") ? this.cfg.www : this.cfg.www[platform]
    }

    start(req, assist) {
        var _this = this;
        this.http.createServer(function (request, response) {
            _this.server = this;
            _this.onRequest.apply(_this, arguments);
        }).listen(this.cfg.port, function () {
            _this.server = this;
            _this.onStart.apply(_this, [this]);
        });
    }

    stop(){
        var _this = this;
        this.http.close(function () {
            _this.onStop.apply(_this, arguments);
        });
    }

    onStart(server) {
        global['_SERVER'] = server;
        this.log("Start server at port: " + this.server.address().port);
        this.evm.emit('onStart', [server, this.assist]); 
    }

    onStop() {
        this.evm.emit('onStop', this.assist);
    }

    onRequest(request, response) {
        global['_REQUEST'] = request;
        global['_RESPONSE'] = request;
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
                global['_REQUEST']['POST'] = _this.rsc.request.krs.post;
                _this.evm.emit('onPreRequest', [_this.rsc.request, response, _this.assist]);
                _this.evm.emit('onRequest', [_this.rsc.request, response, _this.assist]);
                _this.evm.emit('onPosRequest', [_this.rsc.request, response, _this.assist]);
            });
        }else{
            this.evm.emit('onPreRequest', [request, response, this.assist]);
            this.evm.emit('onRequest', [request, response, this.assist]);
            this.evm.emit('onPosRequest', [request, response, this.assist]);
        }
    }

    onError(error) {
        this.evt.emit('onError', [error, this.assist]);
    }

    log(data, filename=false){
        filename = filename ? filename : this.cfg['name'];
        data = typeof (data) === 'string' ? data : JSON.encode(data);
        require('fs').writeFileSync(this.logp + filename + '.log', data);
    }
}
exports.Main = Main;