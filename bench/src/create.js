var createMessengerAdapter = require("@nathanfaucett/messenger_adapter");


module.exports = create;


function create(Messenger) {
    var adapter = createMessengerAdapter(),
        server = new Messenger(adapter.server),
        client = new Messenger(adapter.client);

    client.on("server-message", function(_, callback) {
        callback();
    });

    return {
        server: server,
        client: client
    };
}
