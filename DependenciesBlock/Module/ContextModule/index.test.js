const path = require("path");
const webpack = require("webpack");

test('ContextModule', done => {
    webpack({
        mode: "development",
        entry: "./index.js",
        context: __dirname,
        plugins: [
            compiler => {
                compiler.hooks.compilation.tap("PLUGIN", compilation => {
                    compilation.hooks.seal.tap("PLUGIN", () => {
                        const entryDependency = compilation.entries.get("main").dependencies[0];
                        const module = compilation.moduleGraph.getModule(entryDependency);

                        const ImportContextDependency = require("webpack/lib/dependencies/ImportContextDependency");
                        const contextDependency = module.dependencies[0];
                        expect(contextDependency).toBeInstanceOf(ImportContextDependency);

                        const contextModule = compilation.moduleGraph.getModule(contextDependency);
                        expect(contextModule.context).toBe(path.join(__dirname, "dir"));
                    })
                })
            }
        ]
    }, (err, stats) => {
        expect(err).toBeNull();
        done();
    });
});
