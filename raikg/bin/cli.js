/*
 * @author		Antonio Membrides Espinosa
 * @package    	bin
 * @created		10/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c)
 * @license    	GPL
 * @version    	1.0
 * */
process.env.KCFG = require("path").resolve(__dirname + "/../cfg/config.json");
process.env.KSRP = require("path").resolve(__dirname + "/../")  + require('path').sep;
var ksike_path = __dirname + "/../../ksike";
ksike_path = require("path").resolve(ksike_path);
require(ksike_path + "/bin/cli.js");