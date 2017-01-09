/*
 * @author		Antonio Membrides Espinosa
 * @package    	bin
 * @date		26/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
process.env.KSRP = process.env.KSRP ? process.env.KSRP : __dirname + "/../../../../";
process.env.KSRP = require('path').resolve(process.env.KSRP) + require('path').sep;
process.env.KCFG = process.env.KCFG ? process.env.KCFG :  "/cfg/config.json";
require(__dirname + "/../lib/kfn");
Ksike.src = require(__dirname + "/../");
Ksike.framework = new Ksike.src.Main({
	"root" : process.env.KSRP,
	"cfg": {
		"load" : true,
		"path" : process.env.KCFG
	}
});
Ksike.framework.configure({rsc:{ "process": process}}).dispatch();