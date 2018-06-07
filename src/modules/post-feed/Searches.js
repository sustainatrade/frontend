import React, { Component } from 'react'
import {
    Search
    , List
    , Icon
    , Label
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
        results: []
    }
    render(){
        const { isLoading, searchTxt, results } = this.state;
        return <ResponsiveContext.Consumer>
                {({isMobile})=>{
                    return <PostFeedContext.Consumer>
                    {({ setSearchesFn, searches })=>(<List horizontal={!isMobile}>
                { searches.user && <List.Item style={{textAlign:'center'}}>
                    <Label size='huge' image color='green'>
                        <img src='https://react.semantic-ui.com/assets/images/avatar/small/ade.jpg' />
                            Adrienne
                            <Icon name='delete' />
                    </Label>
                </List.Item> }
                { searches.tag && <List.Item style={{textAlign:'center'}}>
                    <Label size='huge' image color='teal'>
                        <img src='https://imgur.com/download/S18wVvv' />
                            { searches.tag }
                            <Icon name='delete' title='Remove tag search'
                                onClick={()=>{
                                    setSearchesFn({tag:undefined})
                                }}
                            />
                    </Label>
                </List.Item>}
                <List.Item>
                <Search
                    fluid
                    className='searcher'
                    loading={isLoading}
                    placeholder='Search for User, Tag, Etc'
                    onResultSelect={(e, { result }) => {
                            this.setState({ searchTxt: undefined })
                            setSearchesFn({tag:result.title})
                        }}
                    onSearchChange={_.debounce( async (e, { value }) => {
                            await this.setState({ isLoading: true, searchTxt: value })
                            
                            if (this.state.searchTxt.length < 1){
                                await this.setState({ isLoading: false, results: []})
                                return;
                            }

                            const ret = await apolloClient.query({
                                query: TAG_LIST,
                                variables: { search: value }
                            })
                            const { PostTagList } = ret.data;
                            if (PostTagList) {
                                const qResult = PostTagList.list.map(tag=>({
                                    title: tag.name,
                                    price: 'tag'
                                }))
                                this.setState({ isLoading: false, results: qResult })
                            }
                        }, 500, { leading: true })}
                    results={results}
                    value={searchTxt}
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



