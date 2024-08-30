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
                    default: {
                        // chunks 设置为 all 表示优化异步 chunk 和非异步 chunk
                        // 默认仅优化异步 chunk
                        //
                        // 在这个 case 里，build chunk graph 过程只会产生一个 chunk
                        // 这个 chunk 会使用 default chunk group.
                        //
                        // 在 queue 阶段，由于 main chunk 的大小不满足设置，会创建一个新的 chunk，然后把所有 modules 放入
                        //
                        // 在 maxSize 阶段，会将新 chunk 中所有的 module 重新组合成多个满足配置的 chunk。
                        chunks: "all",
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
