import React from "react";
// import TagList from "./TagList";
// import { Segment } from "semantic-ui-react";
import { contents } from "./../../config";
import SectionPosts from "./SectionPosts";
import gql from "graphql-tag";
import postFragment from "./../../gql-schemas/PostFragment";
import { Query } from "react-apollo";
import get from "lodash/get";
import snakeCase from "lodash/snakeCase";
import { postListOutput } from "../../gql-schemas/PostList";
import { useSetSubHeader } from "../../hooks/SetSubHeader";

const contentsKeys = [];
const contentsMap = {};
contents.forEach(c => {
  contentsKeys.push(snakeCase(c.code));
  contentsMap[snakeCase(c.code)] = c;
});

export const CONTENTS_QUERY = gql`
  ${postFragment}
  query {
    ${contents.map(
      content => `
    ${snakeCase(content.code)}:PostList(input: {
      widget: "${content.code}"
      limit: 10
    }) {
      ${postListOutput}
    }
    `
    )}
  }
`;

export default function() {
  useSetSubHeader(null);
  return (
    <div>
      <Query query={CONTENTS_QUERY}>
        {({ loading, error, data }) => {
          console.log("data"); //TRACE
          console.log(data); //TRACE
          return (
            <div style={{ marginTop: 3 }}>
              {contentsKeys.map(cKey => (
                <SectionPosts
                  key={cKey}
                  content={contentsMap[cKey]}
                  posts={get(data, `${cKey}.edges`)}
                />
              ))}
            </div>
          );
        }}
      </Query>
    </div>
  );
}
