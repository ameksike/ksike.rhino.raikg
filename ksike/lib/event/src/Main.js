/*
 * @author		Antonio Membrides Espinosa
 * @package    	KrEvent
 * @date		23/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class EventRequest{
    get(signal, value, index=0, scope=0){
        switch(typeof (value)){
            case 'object':
            case 'array':
                return {
                    "target": value["target"] ? value["target"] : value,
                    "signal": value["signal"] ? value["signal"] : signal,
                    "scope": value["scope"]  ? value["scope"]  : scope
                };
                break;
            default: return { "target": value, "signal": signal,  "scope": scope}; break;
        }
    }
}
class EventResponse{
    get(rsc, params=[]){
        var fn = rsc["target"][rsc["signal"]];
        var sp = rsc["target"]["scope"] ? rsc["target"]["scope"] : rsc["target"];
        return  fn  ? fn.apply(sp, (params instanceof  Array) ? params : [params]) : false;
    }
}

class Event {
    constructor(){
        this.sts = {};
        this.evs = { "main":[] };
        this.req = new EventRequest();
        this.res = new EventResponse();
    }

    configure(opt=false){
        if(opt){
            this.req = opt.req ? opt.req : this.req;
            this.res = opt.res ? opt.res : this.res;
            this.sts = opt.sts ? opt.sts : this.sts;
            this.evs = opt.evs ? opt.evs : this.evs;
        }
        return this;
    }

    add(event, signal="main"){
        if(event){
            if(!this.evs[signal]) this.evs[signal] = [];
            if(typeof (event) === "array"){
                for(var i in event)
                    this.evs[signal].push(event[i]);
            }else {
                this.evs[signal].push(event);
            }
        }
        return this;
    }

    del(index=false, signal="main"){
        index = index === false  ? this.evs[signal].length-1 : index;
        delete this.evs[signal][index];
        return this;
    }

    emit(signal='main', params=[], scope=false, index=0){
        this.sts[signal] = {
            'active': true,
            'index': index,
            'scope': scope,
            'params': params
        };
        if(this.evs[signal]){
            var out = {};
            for(var i=index; i< this.evs[signal].length; i++){
                 if(this.sts[signal]['active']){
                     var target = this.req.get(signal, this.evs[signal][i], i, scope);
                     out[i] = this.res.get(target, params);
                     this.sts[signal]['index'] = i;
                 }
            }
            return out;

        }
        return false;
    }

    stop(signal=false){
        if(signal){
            this.sts[signal]['active'] = false;
            this.sts[signal]['index'] = 0;
        } else {
            for(var i in this.sts){
                this.sts[i]['active'] = false;
                this.sts[i]['index'] = 0;
            }
        }
        return this;
    }

    pause(signal=false){
        if(signal){
                this.sts[signal]['active'] = false;
        } else {
            for(var i in this.sts){
                this.sts[i]['active'] = false;
            }
        }
        return this;
    }

    play(signal='main'){
        return this.emit(signal, this.sts[signal]['params'], this.sts[signal]['score'],  this.sts[signal]['index']+1);
    }
}

exports.Main = Event;
global.Ksike = global.Ksike ? global.Ksike : {};
global.Ksike.Event = {
    "Request" : EventRequest,
    "Response": EventResponse
}