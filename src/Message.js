module.exports = Message;


function Message(id, name, error, data) {
    this.id = id;
    this.name = name;
    this.error = error;
    this.data = data;
}

Message.prototype.toJSON = function() {
    return {
        id: this.id,
        name: this.name,
        error: this.error,
        data: this.data
    };
};