const webpack = require("webpack");

test('LoaderDependency', done => {
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
                            const LoaderDependency = require("webpack/lib/dependencies/LoaderDependency.js");
                            expect(loaderDependency).toBeInstanceOf(LoaderDependency);
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
