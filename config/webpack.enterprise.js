/** @type {import('webpack').Configuration} */
module.exports = {
  resolve: { extensions: [".ts", ".tsx", ".js", ".jsx", ".json"] },
  optimization: { splitChunks: { chunks: "all", maxInitialRequests: 20 }, moduleIds: "deterministic" },
  performance: { hints: "warning", maxAssetSize: 300000 },
  stats: "errors-warnings",
};
