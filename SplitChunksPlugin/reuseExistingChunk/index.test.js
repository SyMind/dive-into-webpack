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
                    defaultVendors: false,
                    default: {
                        reuseExistingChunk: true,
                        minChunks: 2,
                        minSize: 0
                    }
                }
            }
        }
    }, (err, stats) => {
        // 当使用 reuseExistingChunk 时，在拆分 chunk 阶段，会复用原始 chunk graph 中包含相同模块的 chunk。
        // 在这个测试用例中，通过 webpack magic comment 在 build chunk graph 阶段生成以下结构：
        // Chunk 1 (named one): modules A, B, C
        // Chunk 2 (named two): modules B, C
        //
        // 在 split chunk 阶段，如果 reuseExistingChunk 为 false，则结果如下：
        // Chunk 1 (named one): modules A
        // Chunk 2 (named two): 未包含任何模块（因 B、C 模块从 two chunk 中被移除，two chunk 为空并被删除）
        // Chunk 3 (named one~two): modules B, C
        //
        // 若 reuseExistingChunk 为 true，则结果如下：
        // Chunk 1 (named one): modules A
        // Chunk 2 (named two): modules B, C（在拆分模块时扫描到 two chunk 已包含模块 B、C，直接复用）
        //
        // 详细信息请参考此 issue：https://github.com/webpack/webpack.js.org/issues/2122
        expect(err).toBeNull();
        const files = fs.readdirSync(path.join(__dirname, "dist"));
        expect(files).toEqual(expect.arrayContaining([
            "main.js",
            "one.js",
            "page1_js.js",
            "page2_js.js",
            "two.js",
        ]));
        done();
    });
});
