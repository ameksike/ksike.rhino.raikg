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
    constructor(opt=false) {
        this.http = require('http');
        this.cfg = { "port": 3003 };
        this.evm = false;
        this.rsc = {
            "process": process,
            "request": false,
            "response": false
        };
        this.configure(opt, process);
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
            _this.rsc.request = request;
            _this.rsc.response = response;
            global['_REQUEST'] = request;
            global['_RESPONSE'] = response;
            try{
                _this.onRequest.apply(_this, arguments);
            }catch (error){
                _this.onError.apply(_this, [error]);
            }
        }).listen(this.cfg.port, function () {
            _this.server = this;
            try{
                _this.onStart.apply(_this, [this]);
            }catch (error){
                _this.onError.apply(_this, [error]);
            }
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
        this.evm.emit('onError', [error, this.rsc.request, this.rsc.response, this.assist]);
    }

    log(data, filename=false){
        filename = filename ? filename : this.cfg['name'];
        data = typeof (data) === 'string' ? data : JSON.encode(data);
        console.log(this.logp + filename + '.log');
        require('fs').writeFileSync(this.logp + filename + '.log', data);
    }
}
exports.Main = Main;