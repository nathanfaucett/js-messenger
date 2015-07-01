var assert = require("assert"),
    Messenger = require("../src/index");


describe("Messenger(adapter)", function() {
    it("should create Messenger using adapter's postMessage and addMessageListener", function(done) {
        var socket = createTwoWaySocket(),
            client = new Messenger(socket.client),
            server = new Messenger(socket.server),
            count = 0;


        function checkDone() {
            count += 1;
            if (count === 2) {
                done();
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

function Socket() {
    this.socket = null;
    this.__messages = [];
}

Socket.prototype.addMessageListener = function(callback) {
    var messages = this.__messages;
    messages[messages.length] = callback;
};

Socket.prototype.onMessage = function(data) {
    var messages = this.__messages,
        i = -1,
        il = messages.length - 1;

    while (i++ < il) {
        messages[i](JSON.parse(data));
    }
};

Socket.prototype.postMessage = function(data) {
    var socket = this.socket;

    process.nextTick(function() {
        socket.onMessage(JSON.stringify(data));
    });
};
