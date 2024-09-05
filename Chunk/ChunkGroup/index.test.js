const path = require("path");
const webpack = require("webpack");

test('ChunkGroup', done => {
    webpack({
        mode: "development",
        entry: "./index.js",
        context: __dirname,
        devtool: false,
        output: {
            path: path.join(__dirname, "dist")
        },
        optimization: {
            splitChunks: false,
        },
        plugins: [
            compiler => {
                compiler.hooks.compilation.tap("PLUGIN", compilation => {
                    compilation.hooks.afterChunks.tap("PLUGIN", () => {
                        // Entrypoint 是一种 ChunkGroup，用于构建 Chunk 图的起点
                        const entrypoint = compilation.entrypoints.get("main")
                        const ChunkGroup = require("webpack/lib/ChunkGroup");
                        expect(entrypoint).toBeInstanceOf(ChunkGroup);

                        // 在构建 Chunk 图阶段，每个 ChunkGroup 只包含一个 chunk。
                        // 后续 SplitChunksPlugin 处理中，会进一步拆分 chunk。
                        expect(entrypoint.chunks.length).toBe(1);

                        // 通过递归遍历 ChunkGroup 访问到所有子 ChunkGroup
                        const [chunkGroupA, chunkGroupB] = Array.from(entrypoint.childrenIterable);
                        expect(Array.from(chunkGroupA.blocksIterable)[0].request).toBe("./a");
                        expect(Array.from(chunkGroupB.blocksIterable)[0].request).toBe("./b");
                    })
                })
            }
        ]
    }, (err, stats) => {
        expect(err).toBeNull();
        done();
    });
});
