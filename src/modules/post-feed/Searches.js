import React, { Component } from 'react'
import {
    Search
    , List
    , Dropdown
} from 'semantic-ui-react'
import gql from 'graphql-tag'
import apolloClient from './../../lib/apollo'
import PostFeedContext from './../../contexts/PostFeedContext'
import ResponsiveContext from './../../contexts/Responsive'
import _ from 'lodash'
import './Searches.css'

const TAG_LIST = gql`
  query( $search: String ){
    PostTagList(
        search: $search
    ){
        status
        list{
          name
          count
        } 
      }
  }
`;

export default class SearchToolbar extends Component {
    state = {

    }
    render(){
        const { isLoading, searchTxt, results } = this.state;
        return <ResponsiveContext.Consumer>
                {({isMobile})=>{
                    return <PostFeedContext.Consumer>
                    {({ setSearchesFn, searches })=>(<List horizontal={!isMobile}>
                <List.Item>
                <Search
                    fluid
                    className='searcher'
                    loading={isLoading}
                    onResultSelect={(e, { result }) => {
                            this.setState({ searchTxt: result.title })
                            setSearchesFn({tag:result.title})
                        }}
                    onSearchChange={_.debounce( async (e, { value }) => {
                            await this.setState({ isLoading: true, searchTxt: value })
                            
                            if (this.state.searchTxt.length < 1){
                                await this.setState({ isLoading: false })
                                if(searches.tag)
                                    await setSearchesFn({tag:undefined})
                                return;
                            }

                            const ret = await apolloClient.query({
                                query: TAG_LIST,
                                variables: { search: value }
                            })
                            const { PostTagList } = ret.data;
                            if (PostTagList) {
                                console.log('PostTagList.list')//TRACE
                                console.log(PostTagList.list)//TRACE
                                const qResult = PostTagList.list.map(tag=>({
                                    title: tag.name,
                                    price: `${tag.count}`
                                }))
                                this.setState({ isLoading: false, results: qResult })
                            }
                        }, 500, { leading: true })}
                    results={results}
                    value={searchTxt || searches.tag}
                />
                </List.Item>
                <List.Item>
                    <Dropdown text='Sort By' icon='filter' 
                        floating fluid={isMobile}
                        labeled button className='icon'>
                        <Dropdown.Menu>
                            <Dropdown.Header icon='tags' content='Sort By' />
                            <Dropdown.Divider />
                            <Dropdown.Item>Post Date</Dropdown.Item>
                            <Dropdown.Item>Comment Count</Dropdown.Item>
                            <Dropdown.Item>Followers</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </List.Item>
                    </List>)}
                    </PostFeedContext.Consumer>
                }}
        </ResponsiveContext.Consumer>
    }
}