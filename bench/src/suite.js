var suite = new Benchmark.Suite();


suite
    .on("start", function(event) {
        document.getElementById("done").innerHTML = "running";
        console.log("running");
    })
    .on("cycle", function(event) {
        var updates = document.getElementById("info-" + event.target.name);
        updates.innerHTML = event.target;
        console.log(String(event.target));
    })
    .on("complete", function() {
        var updates = document.getElementById("done"),
            fastest = this.filter("fastest"),
            slowest = this.filter("slowest"),
            output = "Fastest is " + fastest.map("name");

        output += " it is " + (fastest[0].hz / slowest[0].hz).toFixed(2) + "x faster";

        updates.innerHTML = output;
        console.log(output);
    });


module.exports = suite;
