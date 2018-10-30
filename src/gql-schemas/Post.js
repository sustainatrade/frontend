import gql from "graphql-tag";

const key = `Post`;
const query = gql`
  query ${key} ($_refNo: String!, $_hash: String) {
    Post(input: { _refNo: $_refNo, _hash: $_hash }) {
      post{
        id
        title
        _refNo
        createdBy
        publishDate
        createdByUser{
          username
        }
        createdDate
        widgets{
          id
          _refNo
          values
          code
          name
          postRefNo
          createdDate
          createdByUser{
            id
            username
          }
        }
      }
    }
  }
`;

export const POST = { key, query };
