const nanoid = require("nanoid");

process.env["NODE_ENV"] = "production";
process.env["NODE_PATH"] = "./src";
process.env["REACT_APP_RAND_HASH"] = nanoid();

var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

const webpackConfigProd = require("react-scripts/config/webpack.config.prod");

webpackConfigProd.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: "static",
    reportFilename: "report.html"
  })
);

webpackConfigProd.plugins.push(
  new SWPrecacheWebpackPlugin({
    minify: true,
    logger(message) {
      if (message.indexOf("Total precache size is") === 0) {
        // This message occurs for every build and is a bit too noisy.
        return;
      }
      console.log(message);
    },
    staticFileGlobsIgnorePatterns: [/^[^\.]*(\.html)?$/],
    runtimeCaching: [
      {
        urlPattern: /^[^\.]*(\.html)?$/,
        handler: "networkFirst"
      }
    ]
  })
);

webpackConfigProd.resolve.alias["@ant-design/icons"] = "purched-antd-icons";

require("react-scripts/scripts/build");
