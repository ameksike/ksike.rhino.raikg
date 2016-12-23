/*
 * @author		Antonio Membrides Espinosa
 * @package    	Raikg Server Module
 * @date		26/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Module
{
    constructor(cfg = false, name=false, engine=false) {
        this.cfg = cfg ? cfg : {};
        this._name= name;
        this.engine = engine;
    }

    get name(){
        return this._name;
    }
    set name(value){
        this._name = this._name ? this._name : value;
    }

    onStart(){ }
    onStop(){ }
    onRestart(){ }
    onError(error){ }
    onRequest(request, response){ }
}

exports.Main =  Module;
global.Raikg = {
    Module: {
        Base: Module
    }
}