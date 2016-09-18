var eventListener = require("@nathanfaucett/event_listener"),
    suite = require("./suite");


var runTest = document.getElementById("run_test"),
    running = false;


require("./old");
require("./new");


eventListener.on(runTest, "click", function onClick() {

    document.getElementById("app").innerHTML = "";
    document.getElementById("info-old").innerHTML = "";
    document.getElementById("info-new").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    if (!running) {
        running = true;

        suite.on("complete", function() {
            running = false;
        });
        suite.run({
            async: true
        });
    }
});
