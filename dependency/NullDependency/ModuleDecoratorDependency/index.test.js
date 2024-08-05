const path = require("path");
const webpack = require("webpack");

test('ModuleDecoratorDependency', done => {
    webpack({
        mode: "development",
        entry: "./index.js",
        context: __dirname,
        output: {
            path: path.join(__dirname, "dist")
        },
        plugins: [
            compiler => {
                compiler.hooks.compilation.tap("PLUGIN", compilation => {
                    compilation.hooks.seal.tap("PLUGIN", () => {
                        const entryDependency = compilation.entries.get("main").dependencies[0];
                        const module = compilation.moduleGraph.getModule(entryDependency);
                        const moduleDecoratorDependency = module.dependencies[0];
                        expect(moduleDecoratorDependency.decorator).toBe("__webpack_require__.nmd");
                    })
                })
            }
        ]
    }, (err, stats) => {
        expect(err).toBeNull();
        done();
    });
});
