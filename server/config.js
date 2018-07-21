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
  postPhotoPath: process.env.POST_PHOTO_PATH || "/file/eco-trade-assets"
};
