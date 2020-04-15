# Raikg Rhino Server
Raikg Rhino Server it is a server written on Node.js in the style of Nginx and Apache servers, tries to take advantage of the best practices of its predecessors.

 Note that Virtualhost is a method for hosting multiple domain names. This allows one server to share its resources, such as memory and processor cycles, without requiring all services provided to use the same host name. The term virtual hosting is usually used in reference to web servers but the principles do carry over to other internet services. 

### Run from CLI 
```cmd
    node raikg:service:start default
```

### Define the virtualhost for Raikg Rhino Server ./virtualhost/default.json
```json
{
  "mode": "http",
  "host": "0.0.0.0",
  "port": 3002,
  "www": {
    "windows": "D:\\users\\tony\\proj\\github\\ksike-rhino\\demo\\mygal",
    "linux":  "/media/data/users/tony/proj/github/ksike-rhino/demo/mygal"
  },
  "log": "log/",
  "index": [ "index.html" ],
  "mods":{
    "onConfigure":[{
      "target": "krhino",
      "cfg": {
        "ns": "lib/vendor/ksike/",
        "cfg": {
          "load" : true,
          "path" : "/cfg/config.json"
        }
      }
    }],
    "onRequest": [ "front", "krhino" ],
    "onStart": ["front"],
    "onDirRequest": ["krhino", "front"],
    "onFileRequest": ["front"]
  },
  "bind":{
    "php": ["php", "5.4.25"],
    "njs": "nodejs",
    "nsp": "nodejs",
    "py": "python"
  },
  "bins":{
    "nodejs":{
      "default": {
        "version":"6.9.1",
        "architecture": "x86"
      }
    }
  }
}
```
With the virtualhost files we can describe all the elements necessary to run our web application, it is a customization mechanism for the web application server.