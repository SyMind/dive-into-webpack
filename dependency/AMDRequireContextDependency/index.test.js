const path = require('path');
const webpack = require("webpack");
const AMDRequireContextDependency = require('webpack/lib/dependencies/AMDRequireContextDependency');

test('AMDRequireContextDependency', done => {
    webpack({
        mode: "development",
        entry: "./index.js",
        devtool: false,
        context: __dirname,
        output: {
            path: path.join(__dirname, 'dist'),
        },
        plugins: [
            compiler => {
                compiler.hooks.compilation.tap("PLUGIN", (compilation, { contextModuleFactory }) => {
                    contextModuleFactory.hooks.afterResolve.tap("PLUGIN", result => {
                        const dependency = result.dependencies[0];
                        expect(dependency).toBeInstanceOf(AMDRequireContextDependency);
                        expect(dependency).toEqual({
                            request: './modules',
                            recursive: true,
                            regExp: /^\.\/.*$/,
                            mode: 'sync',
                            category: 'amd' 
                        });
                    });
                });
            }
        ]
    }, (err, stats) => {
        expect(err).toBeNull();
        done();
    });
});
