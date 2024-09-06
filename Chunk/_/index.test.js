const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

test('Chunk', done => {
    let hmr = false;
    let indexPath;
    let indexCode;

    const compiler = webpack({
        mode: "development",
        entry: [
            // 模块热替换的运行时代码
            'webpack/hot/dev-server.js',
            // 用于 web 套接字传输、热重载逻辑的 web server 客户端
            'webpack-dev-server/client/index.js?hot=true&live-reload=true',
            // 你的入口起点
            "./index.js",
        ],
        context: __dirname,
        devtool: false,
        output: {
            path: path.join(__dirname, "dist")
        },
        optimization: {
            splitChunks: false,
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            compiler => {
                compiler.hooks.compilation.tap("PLUGIN", compilation => {
                    // 将模块拆分为 Chunk, 它们最终被渲染为构建结果中的文件（即 Asset）。
                    // 在 webpack 中，Chunk 分为两类：
                    // 1. 普通 Chunk
                    // 2. 热更新 Chunk (HotUpdateChunk)
                    //
                    // Chunk 自身的数据结构中仅存储唯一标识、配置和状态信息：
                    // 1. Chunk 关联的模块信息存储在 ChunkGraph 中
                    // 2. Chunk 之间的父子关系信息存储在 ChunkGroup 中
                    //
                    // Chunk 主要经历两个阶段：
                    // 1. buildChunkGraph 阶段生成 Chunk 图，通过异步导入对模块进行拆分
                    // 2. SplitChunksPlugin 阶段从 Chunk 提取重复模块，并生成新的 Chunk
                    compilation.hooks.afterChunks.tap("PLUGIN", chunks => {
                        expect(chunks.length).toBe(1);
                        const chunk = chunks[0];
                        expect(chunk.name).toBe("main");
                        expect(chunk.runtime).toBe("main");
                    });

                    compiler.hooks.afterCompile.tap("PLUGIN", () => {
                        // 触发一次 HMR
                        if (!hmr) {
                            setTimeout(() => {
                                indexPath = path.join(__dirname, 'index.js');
                                indexCode = fs.readFileSync(indexPath, 'utf-8');
                                fs.writeFileSync(indexPath, `${indexCode}\nconsole.log("hello, world!");`);
                                hmr = true;
                            });
                        }
                    });

                    // HotUpdateChunk 是临时的，可以在 renderManifest hook 中观察到，它不加入 compilation.chunks
                    compilation.hooks.renderManifest.tap("PLUGIN", (_, { chunk, chunkGraph }) => {
                        if (!hmr) {
                            return;
                        }
                        // HMR 过程中，可以找到 HotUpdateChunk
                        if (chunk instanceof compiler.webpack.HotUpdateChunk) {
                            const modules = chunkGraph.getChunkModules(chunk);
                            // HotUpdateChunk 包含两个模块：
                            // 1. 当前更改的模块（index.js），需要重新计算结果
                            // 2. getFullHash 的 runtime，因为 index.js 的 hash 变更
                            expect(modules[0].rawRequest).toBe("./index.js");
                            expect(modules[1].name).toBe("getFullHash");
                            // HotUpdateChunk 被渲染后，结果会由 compilation.emitAsset() 生成
                            compiler.close(() => {
                                // 恢复 index.js 中的代码
                                fs.writeFileSync(indexPath, indexCode);
                                done();
                            });
                        }
                    });
                });
            }
        ]
    });
    compiler.watch({
        aggregateTimeout: 300,
        poll: undefined,
      },
      (err, stats) => {
        expect(err).toBeNull();
      })
});
