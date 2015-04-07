var assert = require("assert"),
    Messenger = require("../src/index");


describe("Messenger", function() {
    it("should emit data to client/server calling client/server listerners", function() {
        var socket = Messenger.createSocket(),
            client = new Messenger(socket.client),
            server = new Messenger(socket.server);

        server.on("message", function(data, callback) {
            callback(undefined, data);
        });

        client.emit("message", {
            data: "data"
        }, function(error, data) {
            assert.equal(error, undefined);
            assert.deepEqual(data, {
                data: "data"
            });
        });

        client.on("message", function(data, callback) {
            callback(undefined, data);
        });

        server.emit("message", {
            data: "data"
        }, function(error, data) {
            assert.equal(error, undefined);
            assert.deepEqual(data, {
                data: "data"
            });
        });
    });
});
