const webpack = require("webpack");

test('ConstDependency', done => {
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

                        const constDependency = module.presentationalDependencies[0];
                        expect(constDependency.expression).toBe("module.id");
                    })
                })
            }
        ]
    }, (err, stats) => {
        expect(err).toBeNull();
        done();
    });
});
