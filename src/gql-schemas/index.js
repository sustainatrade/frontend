import gql from "graphql-tag";

export * from "./FollowPost";
export * from "./ReportPost";
export * from "./RemovePost";

export const CREATE_POST = gql`
  mutation($post: CreatePostInput) {
    CreatePost(input: $post) {
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

export const EDIT_POST = gql`
  mutation($post: EditPostInput) {
    EditPost(input: $post) {
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

export const GET_POST = gql`
  query($_refNo: String!) {
    Post(input: { _refNo: $_refNo }) {
      status
      widgets
      post {
        id
        title
        section
        category
        description
        photos
        tags
        _refNo
        createdBy
        createdDate
        followerCount
        isFollowing
      }
    }
  }
`;
