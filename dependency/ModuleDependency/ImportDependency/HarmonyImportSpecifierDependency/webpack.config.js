/** @type { import('webpack').Configuration } */
module.exports = {
    mode: "development",
    entry: "./index.js",
    plugins: [
        compiler => {
            compiler.hooks.compilation.tap("PLUGIN", compilation => {
                compilation.hooks.seal.tap("PLUGIN", () => {
                    const dep = compilation.entries.get("main").dependencies[0];
                    const module = compilation.moduleGraph.getModule(dep);
                })
            })
        }
    ]
};
