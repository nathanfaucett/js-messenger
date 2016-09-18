var uuid = require("@nathanfaucett/uuid"),
    Message = require("./Message");


var MessengerPrototype;


module.exports = Messenger;


function Messenger(adapter) {
    var _this = this;

    this.__id = uuid.v4();
    this.__messageId = 0;
    this.__callbacks = {};
    this.__listeners = {};

    this.__adapter = adapter;

    adapter.addMessageListener(function onMessage(data) {
        _this.onMessage(data);
    });
}
MessengerPrototype = Messenger.prototype;

MessengerPrototype.onMessage = function(message) {
    var id = message.id,
        name = message.name,
        callbacks, callback, listeners, adapter, listenersArray;

    if (name) {
        listeners = this.__listeners;
        adapter = this.__adapter;

        if ((listenersArray = listeners[name])) {
            Messenger_send(this, listenersArray, message.data, function onSendCallback(error, data) {
                adapter.postMessage(new Message(id, null, error, data));
            });
        }
    } else if (
        (callback = (callbacks = this.__callbacks)[id]) &&
        isMatch(id, this.__id)
    ) {
        callback(message.error, message.data, this);
        delete callbacks[id];
    }
};

MessengerPrototype.send = function(name, data, callback) {
    var callbacks = this.__callbacks,
        id = this.__id + "." + (this.__messageId++).toString(36);

    if (callback) {
        callbacks[id] = callback;
    }

    this.__adapter.postMessage(new Message(id, name, null, data));
};

MessengerPrototype.emit = MessengerPrototype.send;

MessengerPrototype.on = function(name, callback) {
    var listeners = this.__listeners,
        listener = listeners[name] || (listeners[name] = []);

    listener[listener.length] = callback;
};

MessengerPrototype.off = function(name, callback) {
    var listeners = this.__listeners,
        listener, i;

    if ((listener = listeners[name])) {
        i = listener.length;

        while (i--) {
            if (listener[i] === callback) {
                listener.splice(i, 1);
            }
        }

        if (listener.length === 0) {
            delete listeners[name];
        }
    }
};

function Messenger_send(_this, listeners, data, callback) {
    var index = 0,
        length = listeners.length,
        called = false;

    function next(error, data) {
        if (!error && index !== length) {
            listeners[index++](data, next, _this);
        } else {
            if (called === false) {
                called = true;
                callback(error, data);
            }
        }
    }

    next(void(0), data);
}

function isMatch(messageId, id) {
    return messageId.split(".")[0] === id;
}