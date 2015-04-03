(function(dependencies, global) {
    var cache = [];

    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];
            exports = {};

            cache[index] = module = {
                exports: exports,
                require: require
            };

            callback.call(exports, require, exports, module, global);
            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
    };

    if (typeof(define) === "function" && define.amd) {
        define([], function() {
            return require(0);
        });
    } else if (typeof(module) !== "undefined" && module.exports) {
        module.exports = require(0);
    } else {
        
        require(0);
        
    }
}([
function(require, exports, module, global) {

var Messenger = require(1);


var messenger = new Messenger(new Messenger.AdaptorWebWorker("worker.js"));


messenger.on("fromWorker", function(data, callback) {
    callback(undefined, data);
});

messenger.emit("toWorker", {data: "data"}, function(err, data) {
    console.log(err, data);
});


},
function(require, exports, module, global) {

var MessengerPrototype;


module.exports = Messenger;


Messenger.AdaptorWebWorker = require(2);


function Messenger(adaptor) {
    this.adaptor = adaptor;
}

MessengerPrototype = Messenger.prototype;

MessengerPrototype.on = function(name, callback) {
    this.adaptor.on(name, callback);
};

MessengerPrototype.off = function(name, callback) {
    this.adaptor.off(name, callback);
};

MessengerPrototype.emit = function(name, data, callback) {
    this.adaptor.emit(name, data, callback);
};


},
function(require, exports, module, global) {

var environment = require(3);


var globalWorker;


if (environment.worker) {
    globalWorker = self;
}


module.exports = AdaptorWebWorker;


function AdaptorWebWorker(url) {
    var MESSAGE_ID = 0,
        worker = environment.worker ? globalWorker : new Worker(url),
        listeners = {},
        messages = {};

    worker.onmessage = function(e) {
        var message = JSON.parse(e.data),
            id = message.id,
            name = message.name,
            callback = messages[id];

        if (name) {
            if (listeners[name]) {
                emit(listeners[name], message.data, function(err, data) {
                    worker.postMessage(JSON.stringify({
                        id: id,
                        data: data
                    }));
                });
            }
        } else {
            if (callback) {
                callback(message.error, message.data);
                delete messages[id];
            }
        }
    };

    this.emit = function(name, data, callback) {
        var id = MESSAGE_ID++;

        messages[id] = callback;

        worker.postMessage(JSON.stringify({
            id: id,
            name: name,
            data: data
        }));
    };

    this.on = function(name, callback) {
        var listener = listeners[name] || (listeners[name] = []);
        listener[listener.length] = callback;
    };

    this.off = function(name, callback) {
        var listener = listeners[name],
            i;

        if (listener) {
            i = listener.length;

            while (i--) {
                if (listener[i] === callback) {
                    listener.splice(i, 1);
                }
            }
        }
    };
}

function emit(listeners, data, callback) {
    var index = 0,
        length = listeners.length,
        called = false;

    function done(err, data) {
        if (called === false) {
            called = true;
            callback(err, data);
        }
    }

    function next(err, data) {
        if (err || index === length) {
            done(err, data);
        } else {
            listeners[index++](data, next);
        }
    }

    next(undefined, data);
}


},
function(require, exports, module, global) {

var environment = exports,

    hasWindow = typeof(window) !== "undefined",
    userAgent = hasWindow ? window.navigator.userAgent : "";


environment.browser = !!(
    hasWindow &&
    typeof(navigator) !== "undefined" &&
    window.document
);

environment.node = !environment.browser;

environment.mobile = environment.browser && /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

environment.window = (
    hasWindow ? window :
    typeof(global) !== "undefined" ? global :
    typeof(self) !== "undefined" ? self : {}
);

environment.pixelRatio = environment.window.devicePixelRatio || 1;

environment.document = typeof(document) !== "undefined" ? document : {};

environment.worker = typeof(importScripts) !== "undefined";


}], (new Function("return this;"))()));
