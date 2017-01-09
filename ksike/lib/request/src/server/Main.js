/*
 * @author		Antonio Membrides Espinosa
 * @package    	KsRhino Request
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Main
{
    catchData(request, response, callbac, score){
        var data = '';
        request.on('data', function(chunk) {
            data += chunk.toString();
        });
        request.on('end', function() {
            score = score ? score : this;
            request.krs = { post: require('querystring').parse(data) };
            callbac.apply(score, [request, response, data]);
        });
    }

    http(req){
        var rin  = require("url").parse(req.url, true);
        req.krs = req.krs ? req.krs : { post:false, put:false, delete:false };
        return {
            "type": "request",
            "pattern": rin.pathname,
            "method": req.method,
            "param":{
                "GET": rin.query,
                "POST": req.krs.post,
                "PUT": req.krs.put,
                "DELETE": req.krs.delete,
                "URL":[],
                "REQUEST": []
            }
        };
    }

    cli(process){
        var rout = {
            "type": "request",
            "pattern": false,
            "method": "CLI",
            "param":{
                "CLI": [],
                "URL":[],
                "REQUEST": []
            }
        };
        rout.pattern = (process.argv.length > 2) ? "/" + process.argv[2] : "";
        rout.pattern = rout.pattern.replace(/\:/gi, "/"); //...   new RegExp(":","gi")
        if(process.argv.length > 3){
            for(var i=3; i< process.argv.length; i++)
                rout.param.CLI.push(process.argv[i]);
        }
        return rout;
    }

    analyzer(rsc, type="http"){
        type = type=="http" ? "http" : "cli";
        return this[type](type=="http" ? rsc.request : rsc.process);
    }

    onRequest(assist){
        assist.get("ksike/engine").request = this.analyzer(assist.rsc, assist.get("ksike/bre").mode());
    }
}
exports.Main = Main;