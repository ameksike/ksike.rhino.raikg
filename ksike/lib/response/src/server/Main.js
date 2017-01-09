/*
 * @author		Antonio Membrides Espinosa
 * @package    	KsRhino Response
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Main
{
    constructor(rsc=false){
        this.rsc = {
            "process": false,
            "response": false
        }
    }

    configure(rsc=false){
        if(rsc){
            this.rsc.process = rsc.process ? rsc.process : this.rsc.process;
            this.rsc.response = rsc.response ? rsc.response : this.rsc.response;
        }
        if(this.rsc.response){
            this.rsc.response.writeHead(200, { 'Content-Type': 'text/html' });
        }
        return this;
    }

    show(data){
        if(this.rsc.response){
            this.rsc.response.write(this.format(data));
        }else {
            console.log(data);
        }
    }

    end(data=""){
        if(this.rsc.response){
            this.rsc.response.end(this.format(data));
        }else {
            console.log(data);
        }
    }

    format(data){
        return (typeof (data) != "string") ? ( data instanceof Buffer ? data : JSON.stringify(data)) : data;
    }

    onConfigure(assist){
        this.configure(assist.rsc);
    }

    onResponse(assist){
        var key = assist.get("ksike/engine").request.pattern ? assist.get("ksike/engine").request.pattern : "default";
        var out = assist.get("ksike/engine").response.data[key];
        //this.extract(this.format(assist.get("ksike/engine").response.data));
        if(out) this.end(out);
    }

    extract(list){
        var out = "";
        for(var i in list){
            if(list[i]){
                out += list[i];
            }
        }
        return out;
    }
}
exports.Main = Main;