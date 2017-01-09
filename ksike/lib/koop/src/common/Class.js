/**
 *
 * @package: koop
 * @version: 0.1
 * @description: Class es una libreria para el trabajo con clases, pretende acercar el javascript al paradigma de POO
 * @authors: ing. Antonio Membrides Espinosa
 * @dependencies:
 * @made: 08/12/2010
 * @update: 17/01/2011
 * @license: GPL v2
 *
 */
var sco = typeof(global) != "undefined" ? global : window;
sco.koop = {
	class: function(){
		var _this = koop.class.prototype;
        return _this.factory(arguments);
	},
	namespace: function(strns, owner){
		var ons = owner || sco;
		var lns = this.isString(strns) ? strns.split(".") : strns;
		for(var i in lns){
            ons[lns[i]] = (ons[lns[i]]) ? ons[lns[i]] : {};
            ons = ons[lns[i]];
        }
		return ons;
	},
    whocallme: function(deep, elm){
        deep = deep || 1;
        elm = elm || "function";
        var hand = arguments.callee;
        for(var i=0; i<deep; i++)
            hand = hand.caller;
        return (elm=="function") ? hand : hand.prototype["_"+elm];
    },
    isString: function(str){
        return (typeof str == 'string' || str instanceof String);
    }
}

koop.class.prototype = {
    event:{
        'preBuild':[],
        'posBuild':[],
        'preConstruct':[],
        'posConstruct':[]
    },
	assist: koop,
	keyword:{},
    get: function(params, key){
        if(key == "namespace") return (typeof params[0] != "object") ? params[0] : params[0].name;
        else return (typeof params[0] != "object") ? params[1] : params[0];
    },
    clone: function(_in, _out, _handler, _params){
        for(var i in _in) {
            if(!this.keyword[i]) _out[i] = (_handler instanceof Function) ? _handler(i, _in, _params) : _in[i];
            else this.keyword[i].apply(this, [_in[i], _out]);
        }
        return _out;
    },
    build: function(_prototype){
        return this.clone(_prototype, {_mtd_: { type:"koop.class", buildable:true }});
    },
    locate: function(_class, _namespace){
        var _ns = _namespace.split('.');
        var _cn = _ns.pop();
        _class.prototype._mtd_.ns = _namespace;
        _class.prototype._mtd_.cn = _cn;
        if(_ns.length>0){
            _ns = this.assist.namespace(_ns);
            _ns[_cn] = _class;
        }else sco[_cn] = _class;
    },
	trigger: function(key, scope, params){
		for(var i in this.event[key])
			this.event[key][i].apply(scope, params);
	},
	factory: function(){
        var _prototype = this.get(arguments[0], "prototype");
        var _namespace  = this.get(arguments[0], "namespace");
		var _class = function(){
			if(this._mtd_.buildable){
                koop.class.prototype.trigger('preConstruct', this, arguments);
                if(this.construct) this.construct.apply(this, arguments);
                koop.class.prototype.trigger('posConstruct', this, arguments);
            }
		};
        this.trigger('preBuild', this, [_namespace, _prototype]);
        _class.prototype = this.build(_prototype);
		if(_namespace) this.locate(_class, _namespace);
        this.trigger('posBuild', this, [_namespace, _class]);
        return _class;
	}
}