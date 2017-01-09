/*
 * @author		Antonio Membrides Espinosa
 * @package    	Ksike Rhino View
 * @date		26/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Main
{
    constructor(opt=false){
        this.response = false;
        this.configure(opt);
    }

    configure(opt=false){
        this.response = opt.response ? opt.response : this.response;
    }

    onConfigure(assist){
        this.configure(assist.rsc);
    }

    get(path){
        return require('fs').readFileSync(path);
    }

    render(name="index", path="", type="html", param={}){
        var tpl = path + "src/client/"+ (type=="html" ? "html" : "tpl") +"/"+name+"."+type;
        if(type=="html") return this.get(tpl);
        else{
            var _this = this;
            require("twig").renderFile(tpl, param, function (err, html) {
                _this.response.end(html);
            });
            return false;
        }
    }

    
}
exports.Main = Main;