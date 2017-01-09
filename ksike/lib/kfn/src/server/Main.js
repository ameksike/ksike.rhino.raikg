/*
 * @author		Antonio Membrides Espinosa
 * @package    	Ksike Fn
 * @date		26/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
global.Ksike = global.Ksike ? global.Ksike : {};
Ksike.fn = {};
Ksike.fn.build = function(path, param=false, index="Main"){
    var rsc = require(path);
    return new (rsc[index])(param);
}

Ksike.fn.dbug = {
   "log": function(data=""){
       return console.log(data);
   },
   "die": function(data=""){
       console.log(data);
       process.exit(1);
    }
}

Ksike.fn.merge = function (_this, obj) {
    if(Object.assign) return Object.assign(_this, obj);
    for(var i in obj)
        _this[i] = obj[i];
    return _this;
}

Ksike.fn.methodExists = function(){

}

Ksike.fn.json = {
    encode: function(obj={}){
        return JSON.stringify(obj);
    },
    decode: function(str=""){
        return JSON.parse(str);
    }
}

JSON.encode = function(obj={}){
    return JSON.stringify(obj);
}

JSON.decode = function(str=""){
    return JSON.parse(str);
}
