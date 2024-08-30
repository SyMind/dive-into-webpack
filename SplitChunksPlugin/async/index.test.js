const path = require("path");
const webpack = require("webpack");

// test('SplitChunksPlugin', done => {
    webpack({
        mode: "development",
        entry: "./index.js",
        context: __dirname,
        devtool: false,
        output: {
            path: path.join(__dirname, "dist")
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    // 通过 split chunks 将 c module 提取为单独的 chunk
                    default: {
                        chunks: "async",
                        minChunks: 1,
                        minSize: 0,
                        maxSize: 0, 
                    }
                }
            }
        }
    }, (err, stats) => {
        // expect(err).toBeNull();
        // done();
    });
// });
