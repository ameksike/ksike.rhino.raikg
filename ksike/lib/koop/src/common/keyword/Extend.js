/**
 *
 * @package: koop
 * @subpackage: keyword
 * @version: 0.1
 * @description: Class es una libreria para el trabajo con clases, pretende acercar el javascript a la POO
 * @authors: ing. Antonio Membrides Espinosa
 * @dependencies: koop.class
 * @made: 08/12/2010
 * @update: 09/05/2014
 * @license: LGPL v2
 *
 */
koop.class.prototype.keyword.extend = function(_class, _prototype){};
koop.class.prototype.build = function(_prototype){
    var _pro = false;
    switch (typeof _prototype.extend){
        case "object": _pro = _prototype.extend; break;
        case "string":
            _prototype.extend = this.assist.namespace(_prototype.extend);
        case "function":
            if(_prototype.extend.prototype._mtd_) _prototype.extend.prototype._mtd_.buildable = false;
            _pro = new _prototype.extend;
            if(_prototype.extend.prototype._mtd_) _prototype.extend.prototype._mtd_.buildable = true;
        break;
    }
    if(_pro){
        var _father = _pro.parent ? {"parent":_pro.parent} : {};
        this.clone(_pro, _father, this.scp, { "scope":this, "pro":_pro });
        _pro.parent = _father;
        _pro.parent._mtd_ = _pro._mtd_;
        _pro.construct = function(){
            if(this.parent.construct)
                this.parent.construct.apply(this, arguments);
        }
    }else _pro = {};
    _pro._mtd_= { type:"koop.class", buildable:true };
    if(_pro.parent) _prototype.parent = _pro.parent;
    this.clone(_prototype, _pro);
    return _pro;
}
koop.class.prototype.overloadFunction = function(_value, _owner){
    return (function(action, owner){
        var behavior = function(){
            var _parent = this.parent;
            this.parent = behavior.prototype.parent;
            var _out = behavior.prototype.action.apply(this, arguments);
            this.parent = _parent;
            return _out;
        }
        behavior.prototype.action = action;
        behavior.prototype.parent = owner.parent;
        return behavior;
    })( _value, _owner);
}
koop.class.prototype.scp = function(_key, _owner, _params){
    if (typeof(_owner[_key]) == "function") {
        var action = _params.scope.overloadFunction(_owner[_key], _owner);
        if(_params["pro"]) _params["pro"][_key] = action;
        return action;
    } else return _owner[_key];
}
/*
*  Problems
        Case 1: Tree lineal access
                               _(4)_
                        _(3)_
                  _(2)_
            _(1)_

            this.parent.parent.parent,action();

        Case 2: Not lineal access

                            _(3)_
                    _(2)_                _(5)_
            _(1)_                 _(4)_

            this.parent.parent.action()
                               this.action2()
                                    this.parent.action3();
 * */