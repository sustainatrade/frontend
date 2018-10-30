import gql from "graphql-tag";

const key = `UpdatePostWidgets`;
const query = gql`
  mutation($hash: String, $widgets: [WidgetUpdateInput]!) {
    ${key}(input: { _hash: $hash, widgets: $widgets }) {
      status
      widgets {
        id
        displayName
        types
        values
        _refNo
      }
    }
  }
`;

export const UPDATE_POST_WIDGETS = { key, query };
