var Messenger = require("../.."),
    create = require("./create"),
    suite = require("./suite");


var messengers = create(Messenger);


suite.add("new", {
    defer: true,
    fn: function fn(deferred) {
        messengers.server.emit("server-message", null, function onServerMessage() {
            deferred.resolve();
        });
    },
    onComplete: function onComplete() {
        messengers = create(Messenger);
    }
});
