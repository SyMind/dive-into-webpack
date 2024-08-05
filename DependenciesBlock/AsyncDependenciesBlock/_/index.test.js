const webpack = require("webpack");

test('AsyncDependenciesBlock', done => {
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

                        const dependencies = module.dependencies;
                        expect(dependencies).toHaveLength(0);

                        const block = module.blocks[0];
                        expect(block).toBeInstanceOf(webpack.AsyncDependenciesBlock);
                        expect(block.request).toBe("./a");
                        const blockDependency = block.dependencies[0];
                        const ImportDependency = require("webpack/lib/dependencies/ImportDependency");
                        expect(blockDependency).toBeInstanceOf(ImportDependency);
                        expect(blockDependency.request).toBe("./a");
                    })
                })
            }
        ]
    }, (err, stats) => {
        expect(err).toBeNull();
        done();
    });
});
