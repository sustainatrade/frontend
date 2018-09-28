import React, { Component } from "react";
import {
  Segment,
  Button,
  List,
  Transition,
  Menu,
  Icon,
  Header,
  Divider
} from "semantic-ui-react";
import UserContext from "./../contexts/UserContext";
// import CategoryContext from "./../contexts/CategoryContext";
// import PostFeedContext from "./../contexts/PostFeedContext";
import PostViewContext, { VIEW_MODES } from "./../contexts/PostViewContext";
import CreatePostContext from "./../contexts/CreatePost";
import ResponsiveContext from "./../contexts/Responsive";
import { UserAuth } from "../components";
import { Menus } from "./../App";
import { Router } from "@reach/router";
import TagList from "./home/TagList";

const UserOptions = () => <React.Fragment />;

const PostViewMode = ({
  icon,
  viewMode,
  postViewContext: { postViewMode, setPostViewMode }
}) => {
  return (
    <Button
      icon
      active={postViewMode === viewMode}
      title={viewMode}
      onClick={() => setPostViewMode(viewMode)}
    >
      <Icon name={icon} />
    </Button>
  );
};

const PostViewModes = () => (
  <PostViewContext.Consumer>
    {postViewContext => (
      <Segment size="mini">
        <Header floated="left" style={{ marginTop: 10, color: "grey" }}>
          Post View
        </Header>
        <Button.Group floated="right">
          <PostViewMode
            icon="align justify"
            postViewContext={postViewContext}
            viewMode={VIEW_MODES.compact}
          />
          <PostViewMode
            icon="table"
            postViewContext={postViewContext}
            viewMode={VIEW_MODES.card}
          />
          <PostViewMode
            icon="th"
            postViewContext={postViewContext}
            viewMode={VIEW_MODES.tiled}
          />
        </Button.Group>
        <Divider hidden fitted clearing />
      </Segment>
    )}
  </PostViewContext.Consumer>
);

export default class Sidebar extends Component {
  state = {};

  renderAccount = () => {
    return (
      <div>
        <CreatePostContext.Consumer>
          {({ key, modalOpened, closeModal, openModal }) => (
            <React.Fragment>
              <Button
                disabled={modalOpened}
                fluid
                color="green"
                content={"Create Post"}
                icon="pencil"
                onClick={() => openModal()}
              />
            </React.Fragment>
          )}
        </CreatePostContext.Consumer>
      </div>
    );
  };

  render() {
    const self = this;

    return (
      <ResponsiveContext.Consumer>
        {({ isMobile }) => (
          <UserContext.Consumer>
            {({ user, loading }) => {
              if (loading) return <div />;
              return (
                <Transition.Group
                  as={List}
                  duration={500}
                  verticalAlign="middle"
                >
                  {isMobile && (
                    <Menu stackable key="menu-key">
                      <Menus mobile={isMobile} />
                    </Menu>
                  )}
                  {user ? (
                    <List.Item>
                      <Divider hidden fitted style={{ marginTop: 5 }} />
                      <Segment color="green" style={{ margin: 0 }}>
                        {self.renderAccount()}
                      </Segment>
                    </List.Item>
                  ) : (
                    <List.Item>
                      <Divider hidden fitted style={{ marginTop: 5 }} />
                      <Segment key="login-key" style={{ margin: 0 }}>
                        <center>
                          Start creating your own post by logging in
                          <Divider />
                          <UserAuth />
                        </center>
                      </Segment>
                    </List.Item>
                  )}
                  <List.Item>
                    <PostViewModes />
                  </List.Item>
                  <List.Item>
                    <Router primary={false}>
                      <UserOptions path="u/*" />
                    </Router>
                  </List.Item>
                  <List.Item>
                    <Segment>
                      <TagList />
                    </Segment>
                  </List.Item>
                </Transition.Group>
              );
            }}
          </UserContext.Consumer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
