/*
 * @author		Antonio Membrides Espinosa
 * @package    	Raikg Module Ksike
 * @date		26/10/2016
 * @copyright  	Copyright (c) 2015-2015
 * @license    	GPL
 * @version    	1.0
 * */
class Krhino extends Raikg.Module.Base
{
    constructor(cfg = false, name=false, engine=false) {
        super(cfg, name, engine);
        if(this.engine){
            this.cfg.root = this.cfg.root ? this.cfg.root : (this.engine.cfg ? this.engine.cfg.root : "");
            this.krhino = require(this.cfg.root + "/" +  this.cfg.ns + "src/server/Main.js").Main;
            this.krhino = new this.krhino(this.cfg);
        }
    }

    onRequest(request, response){
        if(this.engine){
            this.engine.evt.stop('onRequest');
            this.krhino.configure({ rsc: this.engine.rsc }).dispatch();
        }
    }

    onDirRequest(dir, request, response){
        if(this.engine){
            if(request.url === '/'){
                this.engine.evt.stop('onRequest');
                this.krhino.configure({ rsc: this.engine.rsc }).dispatch();
            }
        }
    }
}
exports.Main = Krhino;