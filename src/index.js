var MESSENGER_ID = 0,
    MessengerPrototype;


module.exports = Messenger;


function Messenger(adaptor) {
    var _this = this;

    this.__id = (MESSENGER_ID++).toString(36);
    this.__messageId = 0;
    this.__callbacks = {};
    this.__listeners = {};

    this.__adaptor = adaptor;

    adaptor.addMessageListener(function onMessage(data) {
        _this.onMessage(data);
    });
}
MessengerPrototype = Messenger.prototype;

MessengerPrototype.onMessage = function(data) {
    var message = data,
        id = message.id,
        name = message.name,
        callbacks = this.__callbacks,
        callback = callbacks[id],
        listeners, adaptor;

    if (name) {
        listeners = this.__listeners;
        adaptor = this.__adaptor;

        if (listeners[name]) {
            emit(listeners[name], message.data, function callback(error, data) {
                adaptor.postMessage({
                    id: id,
                    error: error || undefined,
                    data: data
                });
            });
        }
    } else {
        if (callback && isMatch(id, this.__id)) {
            callback(message.error, message.data);
            delete callbacks[id];
        }
    }
};

MessengerPrototype.emit = function(name, data, callback) {
    var id = this.__id + "-" + (this.__messageId++).toString(36);

    if (callback) {
        this.__callbacks[id] = callback;
    }

    this.__adaptor.postMessage({
        id: id,
        name: name,
        data: data
    });
};

MessengerPrototype.on = function(name, callback) {
    var listeners = this.__listeners,
        listener = listeners[name] || (listeners[name] = []);

    listener[listener.length] = callback;
};

MessengerPrototype.off = function(name, callback) {
    var listeners = this.__listeners,
        listener = listeners[name],
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

function isMatch(messageId, id) {
    return messageId.split("-")[0] === id;
}
