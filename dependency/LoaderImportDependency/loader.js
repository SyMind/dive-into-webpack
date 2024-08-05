async function loader() {
    await this.importModule("./a.js");
}

module.exports = loader;
