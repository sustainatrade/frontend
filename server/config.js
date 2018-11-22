const fs = require("fs");
const path = require("path");
const ENV_PATH = "./../build/config/env.json";
const envStr = fs.readFileSync(path.resolve(__dirname, ENV_PATH), "utf8");
const env = JSON.parse(envStr);

module.exports = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || "6379"
  },
  localGraphqlServer:
    process.env.LOCAL_GRAPHL_SERVER ||
    "https://graph.sustainatrade.com/graphql",
  siteName: process.env.SITE_NAME || "sustainatrade.com",
  storageServer:
    process.env.STORAGE_SERVER || "https://storage.sustainatrade.com",
  postPhotoPath: process.env.POST_PHOTO_PATH || "/file/eco-trade-assets",
  iconFileName:
    process.env.ICON_FILE_NAME ||
    "3482c4ee454c07d84ec56238494f15427c842f3e.png",
  env
};
