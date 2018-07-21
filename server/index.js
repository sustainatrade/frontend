const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");
const cacheControl = require("express-cache-controller");
const routes = require("./routeloaders");
const compression = require("compression");
const { siteName } = require("./config");

const STATIC_DIR = process.env.STATIC_DIR || "./../build";
const INDEX_PATH = path.resolve(__dirname, STATIC_DIR, "index.html");
const htmlData = fs.readFileSync(INDEX_PATH, "utf8");

app.use(compression());

function routeHandler(routeKey) {
  const router = routes[routeKey];
  return async (request, response) => {
    console.log("request.path"); //TRACE
    console.log(request.path); //TRACE
    const route = request.path;

    const metaTags = await router.fetchMetaTags(route);
    metaTags.OG_SITE_NAME = siteName;
    let data = htmlData;
    for (const key in metaTags) {
      var re = new RegExp("\\$" + key, "g");
      data = data.replace(re, metaTags[key]);
    }
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

app.use(express.static(path.resolve(__dirname, STATIC_DIR)));

app.get("*", function(request, response) {
  const filePath = path.resolve(__dirname, STATIC_DIR, "index.html");
  response.sendFile(filePath);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
