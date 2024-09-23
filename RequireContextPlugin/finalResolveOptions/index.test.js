const webpack = require("webpack");

const EMPTY_RESOLVE_OPTIONS = {};

test('RequireContextPlugin finalResolveOptions', done => {
    webpack({
        mode: "development",
        entry: "./index.js",
        devtool: false,
        context: __dirname,
        plugins: [
            compiler => {
                compiler.hooks.compilation.tap("PLUGIN", (compilation, { contextModuleFactory }) => {
                    contextModuleFactory.hooks.alternativeRequests.tap("PLUGIN", (items, options) => {
                        const finalResolveOptions = compiler.resolverFactory.get(
							"normal",
							options.resolveOptions || EMPTY_RESOLVE_OPTIONS
						).options;
                        expect(finalResolveOptions.modules).arrayContaining(['node_modules']);
                        expect(Array.from(finalResolveOptions.exportsFields)).arrayContaining(['exports']);
                        expect(finalResolveOptions.descriptionFiles).arrayContaining(['package.json']);
                    });
                });
            }
        ]
    }, (err, stats) => {
        expect(err).toBeNull();
        done();
    });
});
