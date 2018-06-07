import React from 'react'
import gql from 'graphql-tag'
import apolloClient from './../lib/apollo'

const Context = React.createContext();
const { Consumer } = Context;


const POST_CREATED = gql`
     subscription ($device: String){
      PostCreated(
         device: $device
       ) {
         status
         post {
           _refNo,
           createdBy,
           createdDate
         }
       }
     }
    `;

const POST_LIST = gql`
    query ($input:PostListInput){
      PostList(
          input: $input
      ){
        status
        list{
          id
          title
          section
          category
          description
          photos
          tags
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
      searches: {},
      unreadPosts: [],
      list: [],
      postListTimeStamp: new Date().toISOString(),
      clearUnreadFn: async () =>{
        // const { limit } =  
        await this.setState({
          unreadPosts:[]
        });
        await this.state.loadMoreFn(0);
      },
      setSearchesFn: async (newSearches) =>{
        const oldSearches = this.state.searches;
        await this.setState({searches:Object.assign({},oldSearches,newSearches)});
        await this.state.loadMoreFn(0);
      },
      setFiltersFn: async (newFilters) =>{
        const oldFilters = this.state.filters;
        await this.setState({filters:Object.assign({},oldFilters,newFilters)});
        await this.state.loadMoreFn(0);
      },
      loadMoreFn: async (forceSkip) =>{
        const { skip:oldSkip, limit, filters, searches, loadingMore, postListTimeStamp } = this.state;
        let skip = oldSkip;
        if(forceSkip>=0){
          skip = forceSkip
          this.setState({
            list: [],
            loadingMore:false,
            noMore:false
          });
        }

        console.info(`Loading more. ${skip}:${limit}`);
        if(loadingMore){
          console.log('waiting for previous loadingMore to finish');
          return;
        }
        this.setState({loadingMore:true});
        const [{ data }] = await Promise.all([
          apolloClient.query({
            query: POST_LIST,
            variables: { 
              input:{
                category: filters.category,
                section: filters.section,
                search: JSON.stringify(searches),
                skip,
                limit,
                requestTimeStamp: postListTimeStamp
              }
            }
          }),
          (()=>new Promise(resolve => setTimeout(resolve, 3000)))()
        ]);
        
        const { PostList } = data;
        // const stateUpdates = {}
        if(PostList.status === 'SUCCESS'){
          const { list } = this.state;
          if(PostList.list.length>0)
            this.setState({
              loadingMore: false,
              skip:skip+limit,
              list: [...list, ...(PostList.list || [])]});
          else
            this.setState({loadingMore:false,noMore:true});
        }
        else{
          // TODO: Error message here
          this.setState({loadingMore:false,noMore:true});
        }
        
      },
      limit: 5,
      skip: 0,
      noMore: false,
      loadingMore: false
    }
    async componentWillMount(){
        const self = this;
        self.state.loadMoreFn(0);
        apolloClient.subscribe({
          query: POST_CREATED,
          variables: { device: 'desktop'}
        }).subscribe({
          next ({data}) {
            console.log('seting state: ');
            console.log(data.PostCreated.post);
            const { unreadPosts } = self.state;
            self.setState({
                unreadPosts:[ data.PostCreated.post, ...unreadPosts],
                postListTimeStamp: new Date().toISOString()
            })
          }
        });
        
    }

    render() {
        const { children } = this.props;
        return <Context.Provider value={this.state}>
                    { children }
                </Context.Provider>
      }
}

export default {
  Provider,
  Consumer
}