/*
 * @author		Antonio Membrides Espinosa
 * @package    	bin
 * @date		26/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
process.env.KSRP = process.env.KSRP ? process.env.KSRP : __dirname + "/../../../../";
var Raikg = new (require(__dirname + "/../src/server/Main.js").Main)();
var cfg = process.argv[2] ? process.argv[2] : "/cfg/virtualhost/default.json";
Raikg.configure({
	"root" : process.env.KSRP,
	"cfg": {
		"load" : true,
		"path" : cfg
	}
}, process).start();