import gql from "graphql-tag";
import postFragment from "./PostFragment";
import { postListOutput } from "./PostList";

const key = `ReplyList`;
const query = gql`
  ${postFragment}
  query ${key} ($input: PostListInput) {
    PostList(input: $input) {
      ${postListOutput}
    }
  }
`;

export const REPLY_LIST = { key, query };
