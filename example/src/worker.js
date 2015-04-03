var Messenger = require("../../src/index");


var messenger = new Messenger(new Messenger.AdaptorWebWorker());


messenger.on("toWorker", function(data, callback) {
    callback(undefined, data);
});

messenger.emit("fromWorker", {data: "data"}, function(err, data) {
    console.log(err, data);
});
