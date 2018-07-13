import React, { Component } from "react";
import {
  Item,
  Grid,
  Modal,
  Image,
  Divider,
  Container
} from "semantic-ui-react";
import apolloClient from "./../../lib/apollo";
import WidgetContext from "./../../contexts/WidgetContext";
import ResponsiveContext from "./../../contexts/Responsive";
import { GlobalConsumer } from "./../../contexts";
import UserContext from "./../../contexts/UserContext";
import gql from "graphql-tag";
import PostItem from "./../post-feed/PostItem";
import PostWidget from "./PostWidget";
import { Comments } from "react-facebook";
import { MsImage } from "./../../components";

const path = localStorage.getItem("postPhotoPath");
const storage = localStorage.getItem("storage");

const CATEGORY_LIST = gql`
  query {
    CategoryList {
      list {
        id
        name
      }
    }
  }
`;

export default class PostView extends Component {
  state = {};

  async componentWillMount() {
    const ret = await apolloClient.query({
      query: CATEGORY_LIST
    });
    const { CategoryList } = ret.data;
    let categories;
    if (CategoryList) {
      categories = {};
      CategoryList.list.forEach(cat => {
        categories[cat.id] = cat.name;
      });
    }
    this.setState({ categories });
  }

  renderComments(post) {
    return (
      <Comments
        width="100%"
        href={`https://sustainatrade.com/posts/${post._refNo}`}
      />
    );
  }

  renderWidgets(post, widgets) {
    return (
      <Item>
        <UserContext.Consumer>
          {({ user, loading }) => {
            // const isMyPost = user && post.createdBy === user.id;
            return (
              <Item.Content>
                <WidgetContext.Consumer>
                  {({ showSelectWidget }) => (
                    <Item.Header style={{ width: "100%" }}>Specs</Item.Header>
                  )}
                </WidgetContext.Consumer>
                <Item.Meta>{widgets.length || 0} Specs</Item.Meta>
                <Item.Description>
                  <ResponsiveContext.Consumer>
                    {({ isMobile }) => (
                      <Grid doubling stretched columns={isMobile ? 1 : 2}>
                        {widgets.map(wId => (
                          <Grid.Column key={wId}>
                            <PostWidget key={wId} fromRefNo={wId} fluid />
                          </Grid.Column>
                        ))}
                      </Grid>
                    )}
                  </ResponsiveContext.Consumer>
                </Item.Description>
              </Item.Content>
            );
          }}
        </UserContext.Consumer>
      </Item>
    );
  }

  render() {
    return (
      <GlobalConsumer>
        {({
          postView: { post, widgets },
          responsive: { isMobile },
          category: { categories }
        }) => {
          if (!(post && categories)) return <div>Loading</div>;

          const renderGallery = () => {
            return (
              <Item>
                <Item.Content>
                  <Item.Header>Gallery</Item.Header>
                  <Item.Meta>{post.photos.length} Photos</Item.Meta>
                  <Item.Description>
                    <Image.Group>
                      {post.photos.map((photo, i) => (
                        <Modal
                          key={i}
                          trigger={
                            <MsImage
                              height={150}
                              width={150}
                              style={{ cursor: "pointer" }}
                              src={`${storage}${path}/${photo}`}
                            />
                          }
                          basic
                          size="small"
                        >
                          <Modal.Content>
                            <center>
                              <Image src={`${storage}${path}/${photo}`} />
                            </center>
                          </Modal.Content>
                        </Modal>
                      ))}
                    </Image.Group>
                  </Item.Description>
                </Item.Content>
              </Item>
            );
          };

          return (
            <Grid doubling columns={2} style={{ margin: 0 }}>
              <Grid.Column width={10} style={{ padding: 0, paddingBottom: 10 }}>
                <Item.Group divided>
                  <PostItem post={post} categories={categories} />
                  {renderGallery()}
                  {this.renderWidgets(post, widgets)}
                </Item.Group>
              </Grid.Column>
              <Grid.Column
                width={6}
                style={{ padding: 0, paddingLeft: isMobile ? 0 : 10 }}
              >
                {this.renderComments(post)}
                <Divider horizontal> More Posts</Divider>
                <Container textAlign="center">No other posts.</Container>
              </Grid.Column>
            </Grid>
          );
        }}
      </GlobalConsumer>
    );
  }
}
