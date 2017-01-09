/*
 * @framework:      Ksike
 * @package:        Engine
 * @version:        1.0
 * @description:    This is simple and Light Framework Engine
 * @authors:        Antonio Membrides Espinosa
 * @mail:           ameksike@gmail.com
 * @created		    28/10/2016
 * @updated		    28/10/2016
 * @copyright  	    Copyright (c) 2015-2015
 * @license:        GPL v3
 * @require:        NodeJs >= 7.0.*, Event
 */
class EngineEventRequest{
    get(signal, value, index=0, scope=0){
        switch(typeof (value)){
            case 'object':
            case 'array':
                value["scope"]  = value["scope"]  ? value["scope"]  : scope;
                value["target"] = value["target"] ? value["target"] : value;
                value["signal"] = value["signal"] ? value["signal"] : signal;
                return value;
                break;
            case 'string':
                return { "target": this.assist.get(value), "signal": signal,  "scope": scope};
                break;
            default: return { "target": value, "signal": signal,  "scope": scope}; break;
        }
    }
}

class Engine
{
    constructor(){
        this.request = { };
        this.response = { data: [] };
        this.cfg = {};
    }

    configure(opt=false){
        this.cfg = opt ? opt : this.cfg;
        this.evm = this.assist.get("ksike/event");
        if(this.cfg.bind){
            var req = new EngineEventRequest();
            req.assist = this.assist;
            this.evm.configure( {"evs": this.cfg.bind, "req": req} );
        }
        if(this.evm.emit) this.evm.emit("onConfigure", this.assist);
        return this;
    }

    process(){
        for(var i in this.cfg.workflow){
            this.assist.get("ksike/event").emit(this.cfg.workflow[i], this.assist);
        }
        return this.response.data;
    }
}
exports.Main = Engine;