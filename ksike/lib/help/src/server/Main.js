/*
 * @author		 
 * @package    	help
 * @created		26/11/2016
 * @updated		26/11/2016
 * @copyright  	Copyright (c) 2015-2020
 * @license    	GPL v3.0
 * @version    	1.0
 * */
class Main
{
    doc(req, assist){
        for(var i in req["REQUEST"]){
            console.log( assist.get("ksike/idiom").get(req["REQUEST"][i]) );
        }
    }

    mtd(module){
        var tmp = this.assist.get(module);
        var obj = {};
        for(var i in tmp){
            if(typeof tmp[i] === "function")
                obj[tmp[i]]= tmp[i];
        }
        return obj;
    }

    preAction(req, assist) {
        //... do it
    }

    posAction(req, assist) {
        //... do it
    }
}
exports.Main = Main;