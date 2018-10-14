import React, { Component } from "react";
import { Search, List } from "semantic-ui-react";
import gql from "graphql-tag";
import classNames from "classnames";
import apolloClient from "./../lib/apollo";
import PostFeedContext, { getTagUrl } from "./../contexts/PostFeedContext";
import ResponsiveContext from "./../contexts/Responsive";
import { navigate } from "@reach/router";
import _ from "lodash";
import "./GlobalSearch.css";

const TAG_LIST = gql`
  query($search: String) {
    PostTagList(search: $search) {
      status
      list {
        id
        name
        displayName
        count
      }
    }
  }
`;

const USER_LIST = gql`
  query($search: String) {
    UserList(input: { search: $search, skip: 0, limit: 5 }) {
      status

      list {
        id
        displayName
      }
    }
  }
`;

export default class SearchToolbar extends Component {
  state = {
    results: []
  };
  render() {
    const { isLoading, searchTxt, results } = this.state;
    const { fluid } = this.props;
    return (
      <ResponsiveContext.Consumer>
        {({ isMobile }) => {
          return (
            <PostFeedContext.Consumer>
              {({ setSearchesFn, searches }) => (
                <List horizontal style={fluid ? { width: "100%" } : {}}>
                  <List.Item>
                    <Search
                      fluid={fluid}
                      className={classNames({
                        searcher: true,
                        "searcher-mobile": isMobile
                      })}
                      loading={isLoading}
                      placeholder="Search"
                      onResultSelect={(e, { result }) => {
                        this.setState({ searchTxt: undefined });
                        // setSearchesFn({ [result.descriptor]: result.key });
                        switch (result.descriptor) {
                          case "PostTag":
                            navigate(getTagUrl(result.model));
                            break;
                          default:
                            break;
                        }
                      }}
                      onSearchChange={_.debounce(
                        async (e, { value }) => {
                          await this.setState({
                            isLoading: true,
                            searchTxt: value
                          });

                          if (this.state.searchTxt.length < 1) {
                            await this.setState({
                              isLoading: false,
                              results: []
                            });
                            return;
                          }

                          const qResult = [];
                          const ret = await Promise.all(
                            [TAG_LIST, USER_LIST].map(query =>
                              apolloClient.query({
                                query,
                                variables: { search: value }
                              })
                            )
                          );
                          ret.forEach(({ data: retData }) => {
                            for (const rKey in retData) {
                              if (rKey.endsWith("List") && retData[rKey]) {
                                console.log("rKey"); //TRACE
                                console.log(rKey); //TRACE
                                const descriptor = rKey.substring(
                                  0,
                                  rKey.length - 4
                                );
                                qResult.push(
                                  ...retData[rKey].list.map(rItem => ({
                                    key: rItem.id,
                                    title: `${rItem.displayName}`,
                                    image:
                                      rItem.photoUrl ||
                                      "https://imgur.com/download/S18wVvv",
                                    price: descriptor,
                                    descriptor,
                                    model: rItem
                                  }))
                                );
                              }
                            }
                          });
                          console.log("qResult"); //TRACE
                          console.log(qResult); //TRACE
                          this.setState({ isLoading: false, results: qResult });
                        },
                        500,
                        { leading: true }
                      )}
                      results={results}
                      value={searchTxt}
                    />
                  </List.Item>
                </List>
              )}
            </PostFeedContext.Consumer>
          );
        }}
      </ResponsiveContext.Consumer>
    );
  }
}
