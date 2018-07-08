import gql from "graphql-tag";

export const FOLLOW_POST = gql`
  mutation($postRefNo: String!, $revoke: Boolean) {
    FollowPost(input: { postRefNo: $postRefNo, revoke: $revoke }) {
      status
    }
  }
`;
