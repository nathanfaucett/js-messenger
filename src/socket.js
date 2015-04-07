var SocketTransportPrototype;


module.exports = Socket;


function Socket() {
    var server = new SocketTransport(),
        client = new SocketTransport();

    server.socket = client;
    client.socket = server;

    this.server = server;
    this.client = client;
}


function SocketTransport() {
    this.socket = null;
}
SocketTransportPrototype = SocketTransport.prototype;

SocketTransportPrototype.onMessage = null;

SocketTransportPrototype.postMessage = function(data) {
    var socket = this.socket;

    if (socket.onMessage) {
        socket.onMessage(data);
    }
};
