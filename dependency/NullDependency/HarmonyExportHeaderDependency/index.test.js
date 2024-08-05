const path = require("path");
const webpack = require("webpack");

test('HarmonyExportHeaderDependency', done => {
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
                        const entryDependency = compilation.entries.get("main").dependencies[0];
                        const module = compilation.moduleGraph.getModule(entryDependency);
                        const [harmonyCompatibilityDependency, harmonyExportHeaderDependency] = module.presentationalDependencies;
                        const HarmonyCompatibilityDependency = require("webpack/lib/dependencies/HarmonyCompatibilityDependency.js");
                        const HarmonyExportHeaderDependency = require("webpack/lib/dependencies/HarmonyExportHeaderDependency.js");
                        expect(harmonyCompatibilityDependency).toBeInstanceOf(HarmonyCompatibilityDependency);
                        expect(harmonyExportHeaderDependency).toBeInstanceOf(HarmonyExportHeaderDependency);
                    });
                });
            }
        ]
    }, (err, stats) => {
        expect(err).toBeNull();
        done();
    });
});
