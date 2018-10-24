import gql from "graphql-tag";

const key = `PublishPost`;
const query = gql`
  mutation ${key}($refNo: String!) {
    PublishPost(refNo: $refNo) {
      status
      post {
        id
        title
        section
        category
        description
        _refNo
      }
    }
  }
`;

export const PUBLISH_POST = { key, query };
