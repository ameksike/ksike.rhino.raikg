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
    onConfigure(){
        if(this.engine){
            this.cfg.root = this.cfg.root ? this.cfg.root : this.engine.www();
            this.krhino = new Ksike.src.Main(this.cfg);
        }
    }

    onRequest(request, response){
        if(this.engine){
            this.engine.evm.pause('onRequest');
            //Ksike.framework.configure({ rsc: this.engine.rsc }).dispatch();
            this.krhino.configure({ rsc: this.engine.rsc }).dispatch();
        }
    }

    onDirRequest(dir, request, response){
        if(this.engine){
            this.engine.evm.pause('onRequest');
            this.engine.evm.pause('onDirRequest');
            //Ksike.framework.configure({ rsc: this.engine.rsc }).dispatch();
            this.krhino.configure({ rsc: this.engine.rsc }).dispatch();
        }
    }
}
exports.Main = Krhino;