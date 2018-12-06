import React from 'react';
import gql from 'graphql-tag';
import get from 'lodash/get';
import apolloClient from './../lib/apollo';
import { POST_LIST } from '../gql-schemas';
import { kebabCase } from 'lodash';

const Context = React.createContext();
const { Consumer } = Context;

export function getShareUrl(post) {
  return `https://${window.location.hostname}/p/${kebabCase(post.title.substring(0, 30))}/${post._refNo}`;
}

export function getUrl(post) {
  let postTitle = post.title;
  if (!postTitle || postTitle.length === 0) postTitle = 'reply';
  return `/p/${kebabCase(postTitle.substring(0, 30))}/${post._refNo}`;
}

export function getTagUrl(tag) {
  return `/t/${tag.name}`;
}

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

class Provider extends React.Component {
  state = {
    filters: {},
    filterOpened: false,
    filterActiveIndex: null,
    searches: {},
    postCount: {},
    unreadPosts: [],
    scrollPos: 0,
    list: [],
    postListTimeStamp: new Date().toISOString(),
    setScrollPos: pos => {
      this.setState({ scrollPos: pos });
    },
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
      const myPosts = get(myPostCount, 'data.PostCount.count');
      const followed = get(followerCount, 'data.PostCount.count');
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
    setSearchesFn: async searchFields => {
      const oldSearches = this.state.searches;
      const newSearch = Object.assign({}, oldSearches, searchFields);
      for (const sKey in newSearch) {
        if (newSearch[sKey] === undefined) {
          delete newSearch[sKey];
        }
      }
      await this.setState({
        searches: newSearch
      });
      await this.state.loadMoreFn(0);
    },
    setFiltersFn: async newFilters => {
      const oldFilters = this.state.filters;
      await this.setState({
        filters: Object.assign({}, oldFilters, newFilters)
      });
      await this.state.loadMoreFn({ reset: true });
    },
    fetchNewSectionPosts: async section => {
      // const { data } = await apolloClient.query({
      //   query: POST_LIST,
      //   variables: {
      //     input: {
      //       section,
      //       skip: 0,
      //       limit: 10
      //     }
      //   }
      // });
    },
    loadMoreFn: async ({ reset } = {}) => {
      const {
        afterCursor: oldAfterCursor,
        limit,
        filters,
        searches,
        loadingMore,
        isFollowing,
        postListTimeStamp
      } = this.state;
      let afterCursor = oldAfterCursor;
      if (reset) {
        afterCursor = null;
        this.setState({
          list: [],
          loadingMore: false,
          noMore: false,
          postListTimeStamp: new Date().toISOString()
        });
      }

      console.info(`Loading more. ${afterCursor}:${limit}`);
      if (loadingMore) {
        console.log('waiting for previous loadingMore to finish');
        return;
      }
      this.setState({ loadingMore: true });
      console.log('filters'); //TRACE
      console.log(filters); //TRACE
      const queryFilters = {};
      if (filters.content) {
        queryFilters.widget = filters.content;
      }
      const { data } = await apolloClient.query({
        query: POST_LIST.query,
        variables: {
          input: {
            search: JSON.stringify(searches),
            after: afterCursor,
            parentPostRefNo: null,
            limit,
            isFollowing,
            ...queryFilters,
            requestTimeStamp: postListTimeStamp
          }
        }
      });
      const { PostList } = data;
      // const stateUpdates = {}
      const { list } = this.state;
      const postList = get(PostList, 'edges', []);
      if (postList.length > 0) {
        const lastIndex = postList.length - 1;
        const newAfterCursor = get(postList, [lastIndex, 'cursor']);
        const updatedList = [...list, ...(postList.map(edge => edge.node) || [])];
        this.setState({
          loadingMore: false,
          afterCursor: newAfterCursor,
          list: updatedList
        });
      } else this.setState({ loadingMore: false, noMore: true });
    },
    limit: 1,
    afterCursor: null,
    noMore: false,
    loadingMore: false
  };
  async componentWillMount() {
    const self = this;
    // self.state.loadMoreFn(0);
    apolloClient
      .subscribe({
        query: POST_CREATED,
        variables: { device: 'desktop' }
      })
      .subscribe({
        next({ data }) {
          console.log('setting state: ');
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
