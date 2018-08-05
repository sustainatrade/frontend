import React, { Component } from "react";
import {
  Segment,
  Button,
  List,
  Transition,
  Menu,
  Form,
  Icon,
  Divider
} from "semantic-ui-react";
import UserContext from "./../contexts/UserContext";
import CategoryContext from "./../contexts/CategoryContext";
import PostFeedContext from "./../contexts/PostFeedContext";
import CreatePostContext from "./../contexts/CreatePost";
import ResponsiveContext from "./../contexts/Responsive";
import { UserAuth } from "../components";
import { Menus } from "./../App";
import { Router } from "@reach/router";

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
                        All<Icon name="grid layout" />
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
                      <Divider horizontal>Account</Divider>
                      <Segment>{self.renderAccount()}</Segment>
                    </List.Item>
                  ) : (
                    <List.Item>
                      <Divider horizontal>Login</Divider>
                      <Segment raised key="login-key" style={{ margin: 0 }}>
                        <center>
                          Start creating your own post by logging in
                          <Divider />
                          <UserAuth />
                        </center>
                      </Segment>
                    </List.Item>
                  )}
                  <List.Item>
                    <Router>
                      <UserOptions path="u/*" />
                      <Filters default />
                    </Router>
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
