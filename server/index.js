const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");
const cacheControl = require("express-cache-controller");
const routes = require("./routeloaders");
const compression = require("compression");
const { siteName, postPhotoPath, storageServer } = require("./config");

const STATIC_DIR = process.env.STATIC_DIR || "./../build";
const INDEX_PATH = path.resolve(__dirname, STATIC_DIR, "index.html");
const htmlData = fs.readFileSync(INDEX_PATH, "utf8");

app.use(compression());

function getReplacedHtml(metaTags) {
  let data = htmlData;
  for (const key in metaTags) {
    var re = new RegExp("\\$" + key, "g");
    data = data.replace(re, metaTags[key]);
  }
  return data;
}

function routeHandler(routeKey) {
  const router = routes[routeKey];
  return async (request, response) => {
    console.log("request.path"); //TRACE
    console.log(request.path); //TRACE
    const route = request.path;

    const metaTags = await router.fetchMetaTags(route);
    metaTags.OG_SITE_NAME = siteName;
    let data = getReplacedHtml(metaTags);
    response.send(data);
  };
}

for (const key in routes) {
  app.get(`/${key}`, routeHandler(key));
  app.get(`/${key}/*`, routeHandler(key));
}

app.get(
  "/service-worker.js",
  cacheControl({
    noCache: true
  }),
  function(request, response) {
    const swPath = path.resolve(__dirname, STATIC_DIR, "service-worker.js");
    response.sendFile(swPath);
  }
);

const rootHandler = (request, response) => {
  const image = "3482c4ee454c07d84ec56238494f15427c842f3e.png";
  const imageUrl = `${storageServer}${postPhotoPath}/${image}?width=75&height=75`;
  const metaTags = {
    OG_TITLE: siteName,
    OG_IMAGE: imageUrl,
    OG_DESCRIPTION: siteName,
    OG_SITE_NAME: siteName
  };
  let data = getReplacedHtml(metaTags);
  response.send(data);
};

app.get("/", rootHandler);

app.use(express.static(path.resolve(__dirname, STATIC_DIR)));

app.get("*", rootHandler);

app.listen(port, () => console.log(`Listening on port ${port}`));
