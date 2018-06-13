import React, { Component } from 'react'
import {
    Item
    , Label
    , Menu
    , Icon
    , Visibility
    , Button
    , Divider
} from 'semantic-ui-react'
// import { Query } from 'react-apollo'
// import gql from 'graphql-tag'
import ContentLoader from 'react-content-loader'
import { startCase } from 'lodash'
import TagList from './TagList'
import PostItem from './PostItem'
import Searches from './Searches'
import Post from './../post-view'
import PostFeedContext from './../../contexts/PostFeedContext'
import PostViewContext from './../../contexts/PostViewContext'
import CategoryContext from './../../contexts/CategoryContext'
import ResponsiveContext from './../../contexts/Responsive'
import Modal from 'antd/lib/modal';



const PlaceHolder = (props) => <ContentLoader
    height={170}
    width={700}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
>
    <rect x="120" y="5" rx="4" ry="4" width="189.54" height="15" />
    <rect x="120" y="23" rx="3" ry="3" width="102" height="10" />
    <rect x="120" y="40" rx="3" ry="3" width="461.82" height="10" />
    <rect x="120" y="55" rx="3" ry="3" width="461.82" height="10" />
    <rect x="120" y="75" rx="2" ry="2" width="115" height="18" />
    <rect x="240" y="75" rx="2" ry="2" width="115" height="18" />
    <rect x="0" y="5" rx="0" ry="0" width="105" height="100" />
</ContentLoader>

export default class PostFeed extends Component {

    state = {
        activeMenu: 'latest',
        fetchTimeStamp: Date.now()
    }

    renderFeed(categories) {
        return <ResponsiveContext.Consumer>
        {({isMobile})=>(<PostFeedContext.Consumer>
                {({setFiltersFn, filters, skip, limit, list, loadingMore, noMore})=>{
                    return <Item.Group divided unstackable={isMobile}>
                            {list.map(post => {
                                return <PostItem isMobile={isMobile} key={post._refNo} post={post} categories={categories} />
                            })}
                            { (loadingMore && !noMore) && <PlaceHolder/>}
                            { noMore && <Button fluid basic color='green' content='Ooops. No more post here!!' />}
                            <Divider key='more-trigger' ></Divider>
                        </Item.Group>
                }}
            </PostFeedContext.Consumer>)}
        </ResponsiveContext.Consumer>
    }

    renderPostView() {
        return <PostViewContext.Consumer>
            {({ post, closeFn }) => {
                return <Modal
                    width='1024px'
                    visible={post !== undefined}
                    title={<div><Icon name='sticky note' />Post View</div>}
                    footer={null}
                    keyboard={false}
                    onCancel={closeFn}
                >
                    {post && <Post />}
                </Modal>
            }}
        </PostViewContext.Consumer>
    }

    createTabMenu = (name, icon, count, onClickFn) => (<Menu.Item
        name={name}
        active={this.state.activeMenu === name}
        onClick={() => {
            this.setState({
                activeMenu: name,
                fetchTimeStamp: Date.now()
            })
            onClickFn && onClickFn();
        }}
    >
        <Icon name={icon} />
        {startCase(name)}
        {count > 0 && <Label color='yellow' content={`${count}`} />}
    </Menu.Item>)

    render() {
        return (<div>
            <TagList />
            <Divider />
            <CategoryContext.Consumer>
                {({ loading, categories }) => {
                    return <React.Fragment>
                        <Searches/>
                        <Divider />
                        <PostFeedContext.Consumer>
                            {({ unreadPosts, clearUnreadFn, loadMoreFn }) => {
                                return <React.Fragment>
                                    <Menu secondary pointing>
                                        {this.createTabMenu('latest', 'time', unreadPosts.length, clearUnreadFn)}
                                        {this.createTabMenu('following', 'bookmark')}
                                    </Menu>
                                    <Visibility fireOnMount 
                                        offset={[10, 10]} 
                                        onUpdate={(e, { calculations }) => {
                                            if(calculations.bottomVisible){
                                                loadMoreFn();
                                            }}
                                        }
                                    >
                                    { categories && this.renderFeed(categories) }
                                    </Visibility>
                                </React.Fragment>
                            }}
                        </PostFeedContext.Consumer>
                        
                    </React.Fragment>
                }}
            </CategoryContext.Consumer>
            {this.renderPostView()}
        </div>)
    }
}
