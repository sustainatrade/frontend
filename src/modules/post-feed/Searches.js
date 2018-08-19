import React, { Component } from "react";
import { Search, List, Icon, Label } from "semantic-ui-react";
import gql from "graphql-tag";
import apolloClient from "./../../lib/apollo";
import PostFeedContext from "./../../contexts/PostFeedContext";
import ResponsiveContext from "./../../contexts/Responsive";
import _ from "lodash";
import "./Searches.css";

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
        photoUrl
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
    return (
      <ResponsiveContext.Consumer>
        {({ isMobile }) => {
          return (
            <PostFeedContext.Consumer>
              {({ setSearchesFn, searches }) => (
                <List horizontal>
                  {searches.User && (
                    <List.Item style={{ textAlign: "center" }}>
                      <Label size="huge" image color="green">
                        <img
                          alt="/"
                          src="https://react.semantic-ui.com/assets/images/avatar/small/ade.jpg"
                        />
                        {searches.User}
                        <Icon
                          name="delete"
                          onClick={() => {
                            setSearchesFn({ User: undefined });
                          }}
                        />
                      </Label>
                    </List.Item>
                  )}
                  {searches.PostTag && (
                    <List.Item style={{ textAlign: "center" }}>
                      <Label size="huge" image color="teal">
                        <img src="https://imgur.com/download/S18wVvv" alt="/" />
                        {searches.PostTag}
                        <Icon
                          name="delete"
                          title="Remove tag search"
                          onClick={() => {
                            setSearchesFn({ PostTag: undefined });
                          }}
                        />
                      </Label>
                    </List.Item>
                  )}
                  <List.Item>
                    <Search
                      className="searcher"
                      loading={isLoading}
                      placeholder="Search for User, Tag, Etc"
                      onResultSelect={(e, { result }) => {
                        this.setState({ searchTxt: undefined });
                        setSearchesFn({ [result.descriptor]: result.key });
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
                                    descriptor
                                  }))
                                );
                              }
                            }
                          });
                          // if (PostTagList) {
                          //     qResult.push(PostTagList.list.map(tag=>({
                          //         key: tag.name,
                          //         title: `${tag.name}(${tag.count})`,
                          //         price: 'tag'
                          //     })))
                          // }
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
