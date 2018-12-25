const wpConfig = require('./webpack.config.default');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function(webpackEnv) {
  console.log('building.. ' + webpackEnv);
  const webpackConfigProd = wpConfig(webpackEnv);
  webpackConfigProd.resolve.alias['@ant-design/icons'] = 'purched-antd-icons';
  webpackConfigProd.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'report.html'
    })
  );
  return webpackConfigProd;
};
