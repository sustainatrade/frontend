const DataLoader = require("dataloader");
const { apiClient } = require("./../lib/graphql-client");
const get = require("lodash/get");
const { postPhotoPath, storageServer } = require("./../config");
// const redis = require("./../lib/redis");

//TODO: add clear cache pubsub

function makeApiQuery(key) {
  return apiClient.query({
    query: `
  query x{
    Post(input:{
      _refNo: "${key}"
    }){
      post{
        id
        title
        tags
        category
        section
        description
        photos
      }
    }
  }
  `
  });
}

class Router extends DataLoader {
  constructor() {
    super(
      async keys => {
        try {
          const metaTagsQueries = keys.map(key => makeApiQuery(key));

          const retVals = await Promise.all(metaTagsQueries);
          return retVals.map(v => {
            return get(v, "data.Post.post", {});
          });
        } catch (err) {
          console.log("err"); //TRACE
          console.log(err); //TRACE
        }
      },
      { maxBatchSize: 100 }
    );
  }

  async fetchMetaTags(route) {
    const [_, posts, title, id] = route.split("/");
    if (id) {
      const post = await this.load(id);
      const image = get(
        post,
        "photos[0]",
        "3482c4ee454c07d84ec56238494f15427c842f3e.png"
      );
      const imageUrl = `${storageServer}${postPhotoPath}/${image}?width=1200&height=630`;
      return {
        OG_TITLE: post.title,
        OG_IMAGE: imageUrl,
        OG_DESCRIPTION: post.description,
        OG_KEYWORDS: get(post, "tags", []).join(",")
      };
    }
  }
}

module.exports = new Router();
