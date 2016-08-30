var tape = require("tape"),
    Messenger = require("../src/index");


tape("should create Messenger using adapter's postMessage and addMessageListener", function(assert) {
    var socket = createTwoWaySocket(),
        client = new Messenger(socket.client),
        server = new Messenger(socket.server),
        count = 0;


    function checkDone() {
        count += 1;
        if (count === 2) {
            assert.end();
        }
    }


    function onClientResponse(data, callback) {
        callback(undefined, data);
    }

    server.on("message", onClientResponse);

    client.emit("message", {
        data: "data"
    }, function(error, data) {
        assert.equal(error, undefined);
        assert.deepEqual(data, {
            data: "data"
        });

        server.off("message", onClientResponse);
        assert.equal(server.__listeners.message, undefined);

        checkDone();
    });


    function onServerResponse(data, callback) {
        callback(undefined, data);
    }

    client.on("message", onServerResponse);

    server.emit("message", {
        data: "data"
    }, function(error, data) {
        assert.equal(error, undefined);
        assert.deepEqual(data, {
            data: "data"
        });

        client.off("message", onServerResponse);
        assert.equal(client.__listeners.message, undefined);

        checkDone();
    });
});


function createTwoWaySocket() {
    var client = new Socket(),
        server = new Socket();

    client.socket = server;
    server.socket = client;

    return {
        client: client,
        server: server
    };
}


var SocketPrototype;


function Socket() {
    this.socket = null;
    this.__messages = [];
}
SocketPrototype = Socket.prototype;

SocketPrototype.addMessageListener = function(callback) {
    var messages = this.__messages;
    messages[messages.length] = callback;
};

SocketPrototype.onMessage = function(data) {
    var messages = this.__messages,
        i = -1,
        il = messages.length - 1;

    while (i++ < il) {
        messages[i](JSON.parse(data));
    }
};

SocketPrototype.postMessage = function(data) {
    var socket = this.socket;

    process.nextTick(function() {
        socket.onMessage(JSON.stringify(data));
    });
};