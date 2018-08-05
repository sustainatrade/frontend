import gql from "graphql-tag";

export const REMOVE_POST = gql`
  mutation($postRefNo: String!, $detail: String!) {
    RemovePost(input: { postRefNo: $postRefNo, detail: $detail }) {
      status
    }
  }
`;
