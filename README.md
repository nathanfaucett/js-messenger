Messenger
=======

two way messenger, requires an adapter


```javascript
var Messenger = require("@nathanfaucett/messenger"),
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
