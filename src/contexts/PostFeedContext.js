import React from "react";
import gql from "graphql-tag";
import get from "lodash/get";
import apolloClient from "./../lib/apollo";
import postFragment from "./../gql-schemas/PostFragment";

const Context = React.createContext();
const { Consumer } = Context;

const POST_CREATED = gql`
  subscription($device: String) {
    PostCreated(device: $device) {
      status
      post {
        _refNo
        createdBy
        createdDate
      }
    }
  }
`;

const POST_LIST = gql`
  ${postFragment}
  query($input: PostListInput) {
    PostList(input: $input) {
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
  }
`;

class Provider extends React.Component {
  state = {
    filters: {},
    filterOpened: false,
    filterActiveIndex: null,
    searches: {},
    postCount: {},
    unreadPosts: [],
    list: [],
    postListTimeStamp: new Date().toISOString(),
    setFilterActiveIndex: idx => {
      this.setState({ filterActiveIndex: idx });
    },
    showFilterDrawer: shown => {
      this.setState({ filterOpened: shown });
    },
    loadPostCountFn: async userRefNo => {
      const [myPostCount, followerCount] = await Promise.all([
        apolloClient.query({
          query: gql`
            query($search: String!) {
              PostCount(input: { search: $search, skip: 0, limit: 0 }) {
                status
                count
              }
            }
          `,
          variables: { search: JSON.stringify({ createdBy: userRefNo }) }
        }),
        apolloClient.query({
          query: gql`
            query {
              PostCount(input: { isFollowing: true, skip: 0, limit: 0 }) {
                status
                count
              }
            }
          `,
          variables: { search: JSON.stringify({ createdBy: userRefNo }) }
        })
      ]);
      const myPosts = get(myPostCount, "data.PostCount.count");
      const followed = get(followerCount, "data.PostCount.count");
      this.setState({ postCount: { followed, myPosts } });
    },
    clearUnreadFn: async () => {
      // const { limit } =
      await this.setState({
        unreadPosts: [],
        searches: {},
        isFollowing: false,
        postListTimeStamp: new Date().toISOString()
      });
      await this.state.loadMoreFn(0);
    },
    loadUserPostsFn: async userRefNo => {
      const { searches } = this.state;
      await this.setState({
        searches: { ...searches, createdBy: userRefNo },
        isFollowing: false,
        postListTimeStamp: new Date().toISOString()
      });
      await this.state.loadMoreFn(0);
    },
    loadingFollowedPostsFn: async () => {
      await this.setState({
        searches: {},
        isFollowing: true,
        postListTimeStamp: new Date().toISOString()
      });
      await this.state.loadMoreFn(0);
    },
    setSearchesFn: async newSearches => {
      const oldSearches = this.state.searches;
      await this.setState({
        searches: Object.assign({}, oldSearches, newSearches)
      });
      await this.state.loadMoreFn(0);
    },
    setFiltersFn: async newFilters => {
      const oldFilters = this.state.filters;
      await this.setState({
        filters: Object.assign({}, oldFilters, newFilters)
      });
      await this.state.loadMoreFn(0);
    },
    fetchNewSectionPosts: async section => {
      const { data } = await apolloClient.query({
        query: POST_LIST,
        variables: {
          input: {
            section,
            skip: 0,
            limit: 10
          }
        }
      });
      console.log("data"); //TRACE
      console.log(data); //TRACE
    },
    loadMoreFn: async forceSkip => {
      const {
        skip: oldSkip,
        limit,
        filters,
        searches,
        loadingMore,
        isFollowing,
        postListTimeStamp
      } = this.state;
      let skip = oldSkip;
      if (forceSkip >= 0) {
        skip = forceSkip;
        this.setState({
          list: [],
          loadingMore: false,
          noMore: false,
          postListTimeStamp: new Date().toISOString()
        });
      }

      console.info(`Loading more. ${skip}:${limit}`);
      if (loadingMore) {
        console.log("waiting for previous loadingMore to finish");
        return;
      }
      console.log("searches"); //TRACE
      console.log(searches); //TRACE
      this.setState({ loadingMore: true });
      const { data } = await apolloClient.query({
        query: POST_LIST,
        variables: {
          input: {
            category: filters.category,
            section: filters.section,
            search: JSON.stringify(searches),
            skip,
            limit,
            isFollowing,
            requestTimeStamp: postListTimeStamp
          }
        }
      });
      console.log("data"); //TRACE
      console.log(data); //TRACE
      const { PostList } = data;
      // const stateUpdates = {}
      if (PostList.status === "SUCCESS") {
        const { list } = this.state;
        if (PostList.list.length > 0)
          this.setState({
            loadingMore: false,
            skip: skip + limit,
            list: [...list, ...(PostList.list || [])]
          });
        else this.setState({ loadingMore: false, noMore: true });
      } else {
        // TODO: Error message here
        this.setState({ loadingMore: false, noMore: true });
      }
    },
    limit: 10,
    skip: 0,
    noMore: false,
    loadingMore: false
  };
  async componentWillMount() {
    const self = this;
    self.state.loadMoreFn(0);
    apolloClient
      .subscribe({
        query: POST_CREATED,
        variables: { device: "desktop" }
      })
      .subscribe({
        next({ data }) {
          console.log("setting state: ");
          if (!data) return;
          console.log(data.PostCreated.post);
          const { unreadPosts } = self.state;
          self.setState({
            unreadPosts: [data.PostCreated.post, ...unreadPosts],
            postListTimeStamp: new Date().toISOString()
          });
        }
      });
  }

  render() {
    const { children } = this.props;
    return <Context.Provider value={this.state}>{children}</Context.Provider>;
  }
}

export default {
  Provider,
  Consumer
};
