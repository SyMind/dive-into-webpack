const path = require("path");
const webpack = require("webpack");

test('ModuleGraph.getParentBlockIndex', done => {
    webpack({
        mode: "development",
        entry: "./index.js",
        context: __dirname,
        devtool: false,
        output: {
            path: path.join(__dirname, "dist")
        },
        plugins: [
            compiler => {
                compiler.hooks.compilation.tap("PLUGIN", compilation => {
                    compilation.hooks.seal.tap("PLUGIN", () => {
                        const moduleGraph = compilation.moduleGraph;

                        const entryDependency = compilation.entries.get("main").dependencies[0];
                        const module = moduleGraph.getModule(entryDependency);
                        const contextDep = module.dependencies[0];
                        const contextModule = moduleGraph.getModule(contextDep);
                        const depA = contextModule.blocks[0].dependencies[0];
                        const depB = contextModule.blocks[0].dependencies[1];
                        expect(moduleGraph.getParentBlockIndex(depA)).toBe(0);
                        expect(moduleGraph.getParentBlockIndex(depB)).toBe(1);
                    })
                })
            }
        ]
    }, (err, stats) => {
        expect(err).toBeNull();
        done();
    });
});
