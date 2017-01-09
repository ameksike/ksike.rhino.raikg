/*
 * @author		Antonio Membrides Espinosa
 * @package    	Front
 * @date		23/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */

class Main {
    constructor(){    }

    execute(controller, action, params){
        var ctrl = this.assist.get(controller, this.assist);
        if(ctrl["preAction"])  ctrl["preAction"].apply(ctrl, params);
        var out =  (ctrl[action]) ? ctrl[action].apply(ctrl, params) : "El controlador "+controller+" o la accion " + action + " no existen.";
        if(ctrl["posAction"])  ctrl["posAction"].apply(ctrl, params);
        return out;
    }

    respond(data){
        this.get("ksike/respond").end(data);
    }

    onDispatch(assist){
        this.assist = assist;
        var req = assist.get("ksike/router").resolve(assist.get("ksike/engine").request);
        assist.get("ksike/engine").request  = req;
        var out = this.execute(req.controller, req.action, [ req.param, assist] );
        assist.get("ksike/engine").response.data[req.pattern ? req.pattern : "default"] = out;
    }
}
exports.Main = Main;