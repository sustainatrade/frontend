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
import CategoryContext from "./../contexts/CategoryContext";
import PostFeedContext from "./../contexts/PostFeedContext";
import PostViewContext, { VIEW_MODES } from "./../contexts/PostViewContext";
import CreatePostContext from "./../contexts/CreatePost";
import ResponsiveContext from "./../contexts/Responsive";
import { UserAuth } from "../components";
import { Menus } from "./../App";
import { Router } from "@reach/router";
import TagList from "./home/TagList";

const Filters = () => {
  return (
    <PostFeedContext.Consumer>
      {({ setFiltersFn, filters }) => {
        const FLTR_BUYING = filters.section === "buy";
        const FLTR_SELLING = filters.section === "sell";
        const FLTR_DEFAULT = undefined;
        return (
          <CategoryContext.Consumer>
            {({ categories: catMap, icons }) => {
              return (
                <List style={{ padding: 0 }}>
                  <List.Item key="flt-section">
                    <Divider horizontal>Section</Divider>
                    <Segment>
                      <Button.Group fluid>
                        <Button
                          color={FLTR_BUYING ? "orange" : FLTR_DEFAULT}
                          onClick={() =>
                            setFiltersFn({
                              section: !FLTR_BUYING ? "buy" : undefined
                            })
                          }
                        >
                          Buy
                        </Button>
                        <Button.Or />
                        <Button
                          color={FLTR_SELLING ? "green" : FLTR_DEFAULT}
                          onClick={() =>
                            setFiltersFn({
                              section: !FLTR_SELLING ? "sell" : undefined
                            })
                          }
                        >
                          Sell
                        </Button>
                      </Button.Group>
                    </Segment>
                  </List.Item>
                  <List.Item>
                    <Divider horizontal>Categories</Divider>
                    <Menu fluid secondary vertical>
                      <Menu.Item
                        name="All"
                        active={!filters.category}
                        onClick={() => {
                          setFiltersFn({ category: undefined });
                        }}
                      >
                        All
                        <Icon name="grid layout" />
                      </Menu.Item>
                      {catMap &&
                        Object.keys(catMap).map(catKey => (
                          <Menu.Item
                            key={catKey}
                            name={catMap[catKey]}
                            active={catKey === filters.category}
                            onClick={() => {
                              setFiltersFn({ category: catKey });
                            }}
                          >
                            {catMap[catKey]}
                            <Icon name={icons[catKey]} />
                          </Menu.Item>
                        ))}
                    </Menu>
                  </List.Item>
                </List>
              );
            }}
          </CategoryContext.Consumer>
        );
      }}
    </PostFeedContext.Consumer>
  );
};

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
