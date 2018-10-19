const nanoid = require("nanoid");

process.env["NODE_ENV"] = "production";
process.env["NODE_PATH"] = "./src";
process.env["REACT_APP_RAND_HASH"] = nanoid();

var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const webpackConfigProd = require("react-scripts/config/webpack.config.prod");

webpackConfigProd.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: "static",
    reportFilename: "report.html"
  })
);

webpackConfigProd.resolve.alias["@ant-design/icons"] = "purched-antd-icons";

require("react-scripts/scripts/build");
