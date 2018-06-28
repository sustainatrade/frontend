import React, { Component } from "react";
import {
  Segment,
  Button,
  List,
  Accordion,
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
import Modal from "antd/lib/modal";
import ComposePost from "./compose-post";
import { UserAuth } from "../components";
import { Menus } from "./../App";

export default class Sidebar extends Component {
  state = {};

  renderFilters = () => {
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

  renderAccountOpts = () => (
    <Form>
      <Form.Group grouped>
        <Form.Radio label="Small" name="size" type="radio" value="small" />
        <Form.Radio label="Medium" name="size" type="radio" value="medium" />
        <Form.Radio label="Large" name="size" type="radio" value="large" />
        <Form.Radio label="X-Large" name="size" type="radio" value="x-large" />
      </Form.Group>
    </Form>
  );

  renderAccount = () => {
    const activeIndex = this.props.accountActiveIndex;
    return (
      <div>
        <CreatePostContext.Consumer>
          {({ key, modalOpened, closeModal, openModal }) => (
            <React.Fragment>
              <Modal visible={modalOpened} onCancel={closeModal} footer={null}>
                <ComposePost key={key} />
              </Modal>
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
        <Accordion as={Menu} vertical fluid size="small">
          <Menu.Item>
            <Accordion.Title
              active={activeIndex === 0}
              content="Posts"
              index={0}
              onClick={this.handleClick}
            />
            <Accordion.Content
              active={activeIndex === 0}
              content={<this.renderAccountOpts />}
            />
          </Menu.Item>
          <Menu.Item>
            <Accordion.Title
              active={activeIndex === 1}
              content="Followed"
              index={1}
            />
            <Accordion.Content active={activeIndex === 1} />
          </Menu.Item>
        </Accordion>
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
              const list = [];
              if (loading) return <div />;
              if (isMobile) {
                list.push(
                  <Menu stackable key="menu-key">
                    <Menus mobile={isMobile} />
                  </Menu>
                );
              }
              if (!user) {
                list.push(
                  <List.Item key="login">
                    <Divider horizontal>Login</Divider>
                    <Segment raised key="login-key" style={{ margin: 0 }}>
                      <center>
                        Start creating your own post by logging in
                        <Divider />
                        <UserAuth />
                      </center>
                    </Segment>
                  </List.Item>
                );
              }
              if (user) {
                list.push(
                  <List.Item key="sdf">
                    <Divider horizontal>Account</Divider>
                    <Segment>{self.renderAccount()}</Segment>
                  </List.Item>
                );
              }

              list.push(
                <List.Item key="flters">{this.renderFilters()}</List.Item>
              );

              return (
                <Transition.Group
                  as={List}
                  duration={500}
                  verticalAlign="middle"
                >
                  {list}
                </Transition.Group>
              );
            }}
          </UserContext.Consumer>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
