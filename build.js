const nanoid = require("nanoid");
const { echo, asyncExec, cat } = require("async-shelljs");

const swConfig = {
  version: nanoid()
};

process.env["NODE_ENV"] = "production";
process.env["NODE_PATH"] = "./src";
process.env["REACT_APP_RAND_HASH"] = swConfig.version;

var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

echo(JSON.stringify(swConfig)).to("server/sw-config.json");

const webpackConfigProd = require("react-scripts/config/webpack.config.prod");

webpackConfigProd.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: "static",
    reportFilename: "report.html"
  })
);

// webpackConfigProd.resolve.alias["@ant-design/icons"] = "purched-antd-icons";

asyncExec("cross-env NODE_PATH=./src react-scripts build").then(() => {
  console.log("---injecting .sw-inject.js");
  cat(".sw-inject.js").toEnd("build/service-worker.js");
  console.log("---done injecting");
});
