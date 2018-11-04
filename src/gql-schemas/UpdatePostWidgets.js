import gql from "graphql-tag";

const key = `UpdatePostWidgets`;
const query = gql`
  mutation($hash: String, $widgets: [WidgetUpdateInput]!) {
    ${key}(input: { _hash: $hash, widgets: $widgets }) {
      status
      widgets {
        id
        _refNo
        code
        name
        postRefNo
      }
    }
  }
`;

export const UPDATE_POST_WIDGETS = { key, query };
