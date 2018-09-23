import gql from "graphql-tag";
import postFragment from "./PostFragment";

export const POST_LIST = gql`
  ${postFragment}
  query($input: PostListInput) {
    PostList(input: $input) {
      status
      list {
        __typename
        ...PostFragment
        ... on RemovedPost {
          isRemoved
          _refNo
          post {
            ...PostFragment
          }
        }
      }
    }
  }
`;
