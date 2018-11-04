import gql from "graphql-tag";
import postFragment from "./PostFragment";

const key = `LastDraft`;
const query = gql`
  ${postFragment}
  query ${key} ($parentPostRefNo: String){
    LastDraft(
      input: {
        parentPostRefNo: $parentPostRefNo
      }
    ){
      post{
        ...PostFragment
      }
    }
  }
`;

export const LAST_DRAFT = { key, query };
