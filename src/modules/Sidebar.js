import React, { Component, useContext } from 'react';
import { Button, List, Transition, Menu, Icon, Header, Divider } from 'semantic-ui-react';
import UserContext from './../contexts/UserContext';
import { Context as LayoutContext } from './../contexts/LayoutContext';
// import CategoryContext from "./../contexts/CategoryContext";
// import PostFeedContext from "./../contexts/PostFeedContext";
import PostViewContext, { VIEW_MODES } from './../contexts/PostViewContext';
import { Context as CreatePostCtx } from './../contexts/CreatePost';
import ResponsiveContext, { Context as ResponsiveCtx } from './../contexts/Responsive';
import { UserAuth } from '../components';
import { Menus } from './../components/main-header/MainHeader';
import { Router, Link } from '@reach/router';
import TagList from './home/TagList';

const UserOptions = () => <React.Fragment />;

function PostViewMode({ icon, viewMode, postViewContext: { postViewMode, setPostViewMode } }) {
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
}

const PostViewModes = () => (
  <PostViewContext.Consumer>
    {postViewContext => (
      <>
        <Header floated="left" size="small" style={{ marginTop: 10, marginRight: 0, color: 'grey' }}>
          Post View
        </Header>
        <Button.Group floated="right">
          <PostViewMode
            icon="align justify"
            postViewContext={postViewContext}
            viewMode={VIEW_MODES.compact}
          />
          <PostViewMode icon="table" postViewContext={postViewContext} viewMode={VIEW_MODES.card} />
          <PostViewMode icon="th" postViewContext={postViewContext} viewMode={VIEW_MODES.tiled} />
        </Button.Group>
        <Divider hidden fitted clearing />
      </>
    )}
  </PostViewContext.Consumer>
);

function AccountControls() {
  const { modalOpened } = useContext(CreatePostCtx);
  const { setShowSidebar } = useContext(LayoutContext);
  const { isMobile } = useContext(ResponsiveCtx);
  return (
    <div>
      <Link to="create">
        <Button
          disabled={modalOpened}
          fluid
          color="green"
          content={'Create Post'}
          icon="pencil"
          onClick={() => isMobile && setShowSidebar(false)}
        />
      </Link>
    </div>
  );
}
export default class Sidebar extends Component {
  state = {};

  render() {
    return (
      <>
        <ResponsiveContext.Consumer>
          {({ isMobile }) => (
            <UserContext.Consumer>
              {({ user, loading }) => {
                if (loading) return <div />;
                return (
                  <Transition.Group as={List} duration={500} verticalAlign="middle">
                    {isMobile && (
                      <Menu stackable key="menu-key">
                        <Menus mobile={isMobile} />
                      </Menu>
                    )}
                    {user ? (
                      <List.Item>
                        <Divider hidden fitted style={{ marginTop: 5 }} />
                        <AccountControls />
                      </List.Item>
                    ) : (
                      <List.Item>
                        <Divider hidden fitted style={{ marginTop: 5 }} />
                        <center>
                          Start creating your own post by logging in
                          <Divider />
                          <UserAuth />
                        </center>
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
                      <TagList />
                    </List.Item>
                  </Transition.Group>
                );
              }}
            </UserContext.Consumer>
          )}
        </ResponsiveContext.Consumer>
      </>
    );
  }
}
