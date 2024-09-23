function rqInContext(x) {
    return require(["./modules/" + x], x => {
        console.log(x)
    });
}

rqInContext("a.js");
