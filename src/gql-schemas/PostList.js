import gql from "graphql-tag";
import postFragment from "./PostFragment";

export const postListOutput = `
pageInfo{
  hasNextPage
}
edges{
  cursor
  node{
    id
    _refNo
    __typename
    ...PostFragment
    ... on RemovedPost {
      isRemoved
      post {
        ...PostFragment
      }
    }
  }
}
`;

const key = `Post`;
const query = gql`
  ${postFragment}
  query ${key} ($input: PostListInput) {
    PostList(input: $input) {
      ${postListOutput}
    }
  }
`;

export const POST_LIST = { key, query };
