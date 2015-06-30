Messenger
=======

Messenger for the browser and node.js


```javascript
var Messenger = require("messenger"),
    SomeMessengerAdapter = require("some_messenger_adapter");


var messenger = new Messenger(new SomeMessengerAdapter());


messenger.on("message", function(data, callback) {
    callback(undefined, data);
});

messenger.emit("message", {
    "data": "Hello"
}, function(error, data) {
    if (error) {
        // handle error
    } else {
        // do something with data
    }
});

```