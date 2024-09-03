const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

test('SplitChunksPlugin', done => {
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
                    default: {
                        minChunks: 1,
                        minSize: 0,
                    }
                }
            }
        }
    }, (err, stats) => {
       // 当一个模块被多个 chunk 使用时才需要考虑拆分，minChunks 用于定义这个阈值。minChunks 的默认值为 2，即模块被 2 个或更多的 chunk 使用时才会被拆分。
        // 但是，即使超过这个阈值，模块也不一定会被单独拆分出来，这是因为如果模块非常小，拆分出来反而不利于性能。而 minSize 用于决定模块的大小是否大于某个值，
        // 只有当模块的大小超过这个值时才会被拆分。
        //
        // 在这个测试用例中，我们通过将 minChunks 设置为 1，minSize 设置为 0，表明不论模块的大小，只要是异步模块，都要单独拆分出来。
        const files = fs.readdirSync(path.join(__dirname, "dist"));
        expect(files).toEqual(expect.arrayContaining([
            "default-a_js.js",
            "default-b_js.js",
            "default-c_js.js",
            "main.js",
        ]));
        done();
    });
});
