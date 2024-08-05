const webpack = require("webpack");

test('LoaderImportDependency', done => {
    webpack({
        mode: "development",
        entry: "./index.js",
        context: __dirname,
        plugins: [
            compiler => {
                compiler.hooks.normalModuleFactory.tap("PLUGIN", normalModuleFactory => {
                    normalModuleFactory.hooks.afterResolve.tap("PLUGIN", resolveData => {
                        if (resolveData.request === "./a.js") {
                            const loaderDependency = resolveData.dependencies[0];
                            const LoaderImportDependency = require("webpack/lib/dependencies/Loader.js");
                            expect(loaderDependency).toBeInstanceOf(LoaderImportDependency);
                        }
                    });
                });
            }
        ]
    }, (err, stats) => {
        expect(err).toBeNull();
        done();
    });
});
