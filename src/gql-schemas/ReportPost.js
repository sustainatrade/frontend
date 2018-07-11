import gql from "graphql-tag";

export const REPORT_POST = gql`
  mutation($postRefNo: String!, $detail: String!) {
    ReportPost(input: { postRefNo: $postRefNo, detail: $detail }) {
      status
    }
  }
`;
