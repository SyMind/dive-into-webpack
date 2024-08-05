function loader() {
    this.loadModule("./a.js", (err, source, sourceMap, module) => {
    });
}

module.exports = loader;
