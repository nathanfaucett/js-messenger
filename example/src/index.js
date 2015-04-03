var Messenger = require("../../src/index");


var messenger = new Messenger(new Messenger.AdaptorWebWorker("worker.js"));


messenger.on("fromWorker", function(data, callback) {
    callback(undefined, data);
});

messenger.emit("toWorker", {data: "data"}, function(err, data) {
    console.log(err, data);
});
