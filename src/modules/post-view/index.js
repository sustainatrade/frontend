import React, { Component } from 'react'
import {
    Item,
    Grid,
    Segment,
    Modal,
    // Divider,
    Image
} from 'semantic-ui-react'
import apolloClient from './../../lib/apollo'
import PostViewContext from './../../contexts/PostViewContext'
import gql from 'graphql-tag'
import PostItem from './../post-feed/PostItem'
// import { DisQusDiscussion } from './disqus'
import { Comments } from 'react-facebook';
// import StackGrid from "react-stack-grid";
import { MsImage } from './../../components'

const path = localStorage.getItem('postPhotoPath')
const storage = localStorage.getItem('storage')

const CATEGORY_LIST = gql`
  query{
    CategoryList{
        list{
        id
        name
        }
    }
  }
`;

export default class PostView extends Component {
    state = {}

    async componentWillMount() {
        const ret = await apolloClient.query({
            query: CATEGORY_LIST
        })
        const { CategoryList } = ret.data;
        let categories;
        if (CategoryList) {
            categories = {}
            CategoryList.list.forEach(cat => {
                categories[cat.id] = cat.name;
            })
        }
        this.setState({ categories });
    }

    renderComments(post) {
        return <Comments width="100%" href={`https://sustainatrade.com/posts/${post._refNo}`} />
    }
    render() {
        const { categories } = this.state;

        return <PostViewContext.Consumer>
            {({ post }) => {
                if (!(post && categories)) return <div>Loading</div>;

                const renderGallery = () => {
                    return <Item>
                        <Item.Content>
                            <Item.Header>
                                Gallery
                            </Item.Header>
                            <Item.Meta>
                                {post.photos.length} Photos
                            </Item.Meta>
                            <Item.Description>
                                <Image.Group>
                                    {post.photos.map((photo,i)=>(
                                        <Modal key={i} trigger={<MsImage 
                                                height={150}
                                                width={150}
                                                style={{cursor:'pointer'}} 
                                                src={`${storage}${path}/${photo}`} />}
                                            basic size='small'>
                                            <Modal.Content>
                                                <center><Image src={`${storage}${path}/${photo}`} /></center>
                                            </Modal.Content>
                                        </Modal>))}
                                </Image.Group>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                }

                return <Grid
                    doubling
                    columns={2}
                    style={{ margin: 0 }}
                >
                    <Grid.Column width={10} style={{padding:0,paddingBottom:10}}>
                        <Item.Group divided>
                            <PostItem post={post} categories={categories} />
                            { renderGallery() }
                        </Item.Group>
                    </Grid.Column>
                    <Grid.Column width={6} style={{padding:0}}>
                        <Segment>
                            { this.renderComments(post) }
                        </Segment>
                    </Grid.Column>
                </Grid>
            }}
        </PostViewContext.Consumer>
    }
}