/*
 * @author		Antonio Membrides Espinosa
 * @package    	Raikg Module Security
 * @date		26/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Security extends Raikg.Module.Base
{
    onRequest(request, response){
        console.log("**********************************-Security");
        /*
        console.log("Error: URL '" + request.url + "' not found.");
        response.writeHead(403);
        response.end("Error: Forbidden, URL '" + request.url + "' not found.");*/
    }

    onDirRequest(dir, request, response){
        console.log("Error: URL '" + request.url + "' do not acces to directory.");
        response.writeHead(403);
        response.end("Error: do not acces to directory: " + dir );
    }
}
exports.Main = Security;