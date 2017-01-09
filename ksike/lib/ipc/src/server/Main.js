/*
 * @author		Antonio Membrides Espinosa
 * @package    	Ksike Rhino IPC
 * @created		28/10/2016
 * @updated		28/10/2016
 * @copyright  	Copyright (c)
 * @license    	GPL
 * @version    	1.0
 * */
class Ipc
{
    constructor(){
        this.ps = {};
    }

    start(app, arvs=[], background=true, opt=false){
        try{
            opt = opt ? opt : (background ? {detached: true, stdio: 'ignore'} : {});
            var child = require('child_process').spawn(app, arvs, opt);
            this.ps[child.pid] = child;
            //child.stderr.pipe(require('fs').createWriteStream("PS.log"));
            if(background) child.unref();
            return child;
        }catch(error){
            return false;
        }
    }

    exec(app, callback, params=[], scope=false){
        require('child_process').exec(app, function (error, stdout, stderr) {
            if (error) {
                console.error(`Ksike/IPC Error: ${error}`);
                return;
            }
            if(typeof (callback) === 'function'){
                params = params ? params : [];
                scope = scope ? scope :  this;
                params.push(stdout);
                callback.apply(scope, params);
            }
        });
    }

    stop(pid){
        try {
            process.kill(pid, 'SIGKILL');
        }catch(error){
            //console.log("Error: process '"+pid+"' do not exists.");
            return false;
        }
        return true;
    }

    status(pid){
        try {
            if(/win/.test(process.platform)){
                var out = require('child_process').execSync("tasklist /FI \"PID eq "+pid+" \"");
                if(out.toString().length < 90 ) return false;
            }else{
                process.kill(pid, 'SIGPIPE');
            }
        }catch(error){
            return false;
        }
        return true;
    }

    event(pid, even, callback){
        //... even => [ stdout, stderr, close]
        if(!this.ps[pid]) return false;
        if(typeof(callback) !== "function") return false;
        switch(even){
            case "stdout":
            case "data":
                if(!this.ps[pid]["stdout"]) return false;
                this.ps[pid]["stdout"].on('data', callback);
                break;

            case "stderr":
                if(!this.ps[pid]["stderr"]) return false;
                this.ps[pid]["stderr"].on('data', callback);
                break;

            default:
                workerProcess.on(even, callback);
                break;
        }
        return true;
    }
}
exports.Main = Ipc;