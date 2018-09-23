import React from "react";
// import TagList from "./TagList";
// import { Segment } from "semantic-ui-react";
import { sections } from "./../../config";
import SectionPosts from "./SectionPosts";
import gql from "graphql-tag";
import postFragment from "./../../gql-schemas/PostFragment";
import { Query } from "react-apollo";
import get from "lodash/get";

export const SECTIONS_QUERY = gql`
  ${postFragment}
  query {
    ${sections.map(
      section => `
    ${section.key}:PostList(input: {
      section: "${section.key}"
      skip: 0,
      limit: 10
    }) {
      status
      list {
        id
        _refNo
        __typename
        ...PostFragment
        ... on RemovedPost {
          isRemoved
          post {
            ...PostFragment
          }
        }
      }
    }
    `
    )}
  }
`;

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <Query query={SECTIONS_QUERY}>
          {({ loading, error, data }) => {
            return (
              <div style={{ marginTop: 3 }}>
                {sections.map(section => (
                  <SectionPosts
                    key={section.key}
                    section={section}
                    posts={get(data, `${section.key}.list`)}
                  />
                ))}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}
