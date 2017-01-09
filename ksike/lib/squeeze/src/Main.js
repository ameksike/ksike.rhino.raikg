class Squeeze
{
	targz(input, output){
		//var type = require("fs").statSync(input).isDirectory() ? 'directory' : "file";
		require('fstream').Reader({ 'path': input, 'type': 'directory' })
			.pipe(require('tar').Pack())     
			.pipe(require('zlib').Gzip())   
			.pipe(require('fstream').Writer({ 'path':  output }))
			.on("end", function () {
				console.log("ended targz");
			}); 
	}
	
	untargz(input, output){
		require('fs').createReadStream(input)
			.pipe(require('zlib').Gunzip())
			.pipe(require('tar').Extract({ path: output }))
			.on("end", function () {
				console.log("ended untargz");
			});
	}
	
	gzip(input, output){ 
		var gzip = require('zlib').createGzip();  
		var finp = require('fs').createReadStream(input);  
		var fout = require('fs').createWriteStream(output);
		finp.pipe(gzip).pipe(fout);  
	}
	
	ungzip(input, output){
		var unzip = require('zlib').createUnzip();  
		var finp = require('fs').createReadStream(input);  
		var fout = require('fs').createWriteStream(output);  
		finp.pipe(unzip).pipe(fout);  
	}
	
	
	zip(input, output){
		function zipsave(path, rsc, callback=false ){
			var tmp = rsc.generateNodeStream({
				type:'nodebuffer', 
				streamFiles:true
			}).pipe(require("fs").createWriteStream(path));
			if(typeof(callback)==="function") tmp.on('finish', callback);
			return rsc;
		}  

		function ziplist(path, rsc=false){
			if(require("fs").statSync(path).isDirectory()){
				var tmp = require("fs").readdirSync(path);
				for(var i in tmp){
					var ltmp = path +  require('path').sep + tmp[i];
					if(require("fs").statSync(ltmp).isDirectory())
					{
						ziplist(ltmp, rsc.folder(tmp[i]));
					}else{
						rsc.file(tmp[i], require("fs").readFileSync(ltmp));
					}
				}
			}else{
				rsc.file(require('path').basename(path), require("fs").readFileSync(path));
			}
			return rsc;
		}
		
		var JSZip = require("jszip");
		var zip = new JSZip();

		ziplist(input, zip);
		zipsave(output, zip, function(){
			console.log("finishing");
		});
	}
	
}
exports.Main = Squeeze;