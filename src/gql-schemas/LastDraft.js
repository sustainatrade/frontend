import gql from "graphql-tag";

const key = `LastDraft`;
const query = gql`
  query ${key} {
    LastDraft{
      post{
        id
        _refNo
        title
        publishDate
        createdBy
        widgets{
          id
          _refNo
          code
          name
          values
        }
      }
    }
  }
`;

export const LAST_DRAFT = { key, query };
