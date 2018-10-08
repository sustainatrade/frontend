import gql from "graphql-tag";

const key = `GetPost`;
const query = gql`
  query ${key} ($_refNo: String!, $_hash: String) {
    Post(input: { _refNo: $_refNo, _hash: $_hash }) {
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

export const GET_POST = { key, query };
