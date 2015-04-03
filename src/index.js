var MessengerPrototype;


module.exports = Messenger;


Messenger.AdaptorWebWorker = require("./adaptor_web_worker");


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
