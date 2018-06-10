import React, { Component } from 'react'
import {
    Label,
    Item,
    Button,
    List,
    Icon
    // Container
} from 'semantic-ui-react'
import PostViewContext from './../../contexts/PostViewContext'
import PostFeedContext from './../../contexts/PostFeedContext'
import CategoryContext from './../../contexts/CategoryContext'
// import { CommentsCount } from 'react-facebook';
import moment from 'moment'
import UserLabel from './../user-profile/UserLabel'
import { MsImage } from './../../components'
import './PostItem.css'

const path = localStorage.getItem('postPhotoPath')
const storage = localStorage.getItem('storage')

export default class PostItem extends Component {

    renderActions(post, isMobile) {

        const followerColor = post.section === 'sell' ? 'green' : 'orange';

        return <React.Fragment>
            { isMobile && <Label as='a' className='actn-lbl' color={followerColor}>
                <Icon name='bookmark' /> 0
            </Label>}
            { !isMobile && <Button as='div' labelPosition='right' title='Click to follow'>
                <Button color={followerColor} icon>
                    <Icon name='bookmark' />
                </Button>
                <Label color={followerColor} as='a' basic pointing='left'>0</Label>
            </Button>}
            <PostViewContext.Consumer>
                {({ viewPostFn }) => {
                    if(isMobile)
                        return <Label as='a' className='actn-lbl'>
                            <Icon name='quote left' />
                            {/* <CommentsCount href={`https://sustainatrade.com/posts/${post._refNo}`} /> */}
                        </Label>
                    if(!isMobile)
                        return <Button as='div' labelPosition='right' title='Comments' onClick={()=>viewPostFn(post._refNo)}>
                            <Button color='black' icon>
                                <Icon name='quote left' title='Comments' />
                            </Button>
                            <Label as='a' basic pointing='left'>
                                {/* <CommentsCount href={`https://sustainatrade.com/posts/${post._refNo}`} /> */}
                            </Label>
                        </Button>
                    }}
            </PostViewContext.Consumer>
            { !isMobile && <Button icon='flag' title='Report'></Button>}
            {/* { isMobile && <Label as='a' className='actn-lbl'>
                    <Icon name='flag' />
                </Label>}
            } */}
        </React.Fragment>

    }

    render() {
        const { post, isMobile } = this.props;

        let feedPhoto = 'https://react.semantic-ui.com/assets/images/wireframe/image.png';
        if (post.photos[0])
            feedPhoto = `${storage}${path}/${post.photos[0]}`

        return <Item className='post'>
            <PostFeedContext.Consumer>
                        {({setSearchesFn})=>(
                <PostViewContext.Consumer>
                    {({ viewPostFn, loading }) => (<React.Fragment>
                        <MsImage as={Item.Image} src={feedPhoto} 
                            height={isMobile?125:200}
                            width={isMobile?125:200}
                            loading={loading}
                            block
                            style={{cursor:'pointer',minHeight:(isMobile?125:200)}}
                            onClick={() => viewPostFn(post._refNo)}
                        >{ isMobile && this.renderActions(post, 'tiny')}</MsImage>
                        <Item.Content>
                            { !isMobile && <div style={{float:'right'}}>
                            {this.renderActions(post)}
                            </div>}
                            <Item.Header as='a' onClick={() => viewPostFn(post._refNo)}>{post.title}</Item.Header>
                            <Item.Meta>
                                <List>
                                    <List.Item>
                                        <List.Icon name='user' />
                                        <List.Content>
                                            <UserLabel refNo={post.createdBy}/>
                                        </List.Content>
                                    </List.Item>
                                    <List.Item>
                                        <List.Icon name='clock' />
                                        <List.Content>{moment(new Date(post.createdDate)).fromNow()}</List.Content>
                                    </List.Item>
                                </List>
                                <div>
                                    <Label color={post.section === 'sell' ? 'green' : 'orange'}>
                                        <Icon name='weixin'/>
                                        <Label.Detail>{post.section.toUpperCase()}</Label.Detail>
                                    </Label>
                                    <CategoryContext.Consumer>{({icons, categories})=>(
                                        <Label color={'black'} >
                                            <Icon name={icons[post.category]}/>
                                            <Label.Detail>{categories[post.category]}</Label.Detail>
                                        </Label>)}
                                    </CategoryContext.Consumer>
                                </div>
                            </Item.Meta>
                            <Item.Description>{post.description}</Item.Description>
                            <Item.Extra>
                                <div>
                                    {post.tags.map(tag => (
                                        <Label key={tag} size='small' 
                                            onClick={()=>setSearchesFn({PostTag:tag})}
                                            style={{cursor:'pointer'}}
                                            content={tag} />
                                    ))}
                                </div>
                            </Item.Extra>
                        </Item.Content>
                    </React.Fragment>)}
                </PostViewContext.Consumer>)}
            </PostFeedContext.Consumer>
        </Item>
    }
}