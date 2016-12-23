/*
 * @author		Antonio Membrides Espinosa
 * @package    	Raikg Event Manage
 * @date		23/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class RkEvent
{
    constructor(){
        this.sts = {};
        this.evs = [];
    }

    add(event){
        this.evs.push(event);
        return this.evs.length - 1;
    }

    del(index=false){
        index = index === false  ? this.evs.length-1 : index;
        delete this.evs[index];
    }

    emit(signal='main', params=[], score=false, index=0){
        this.sts[signal] = {
            'active': true,
            'index': index,
            'score': score,
            'params': params
        }
        var out = {};
        for(var i=index; i< this.evs.length; i++){
            if(this.sts[signal]['active']){
                var score = this.sts[signal]['score'] ? this.sts[signal]['score'] : this.evs[i];
                if(this.evs[i][signal])
                    out[i] = this.evs[i][signal].apply(score, params);
                this.sts[signal]['index'] = i;
            }
        }
        return out;
    }

    stop(signal=false){
        if(signal){
                this.sts[signal]['active'] = false;
        } else {
            for(var i in this.sts){
                this.sts[i]['active'] = false;
            }
        }
    }

    play(signal='main'){
        return this.emit(signal, this.sts[signal]['params'], this.sts[signal]['score'],  this.sts[signal]['index']+1);
    }
}
exports.Main = RkEvent;