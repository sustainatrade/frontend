import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { FOLLOW_POST } from 'gql-schemas';
import { Icon } from 'semantic-ui-react';

// const ACTION_BUTTON_SIZE = config.posts.actionButtonSize;

export default class FollowButton extends Component {
  state = {};
  render() {
    const { post } = this.props;
    return (
      <Mutation mutation={FOLLOW_POST}>
        {(followPost, { data, loading, error }) => {
          // let followerColor;
          // let title = 'Click to follow';
          let followers = post.followerCount;
          const { newFollowing } = this.state;
          let following = post.isFollowing;
          const iconProps = { name: 'bookmark' };
          if (loading) {
            iconProps.name = 'spinner';
            iconProps.loading = true;
          }
          if (data) {
            following = newFollowing;
            if (post.isFollowing) {
              if (!following) followers--;
            } else if (following) followers++;
          }

          // if (following) {
          //   title = 'Unfollow';
          //   followerColor = post.section === 'sell' ? 'green' : 'orange';
          // }
          // const onClickHandler = async () => {
          //   // const { toggles } = this.state;
          //   followPost({
          //     variables: {
          //       postRefNo: post._refNo,
          //       revoke: following
          //     }
          //   });
          //   this.setState({ newFollowing: !following });
          // };
          return (
            <span style={{ display: 'inline-block', marginTop: 10 }}>
              <Icon {...iconProps} /> {followers || 0}
            </span>
          );
        }}
      </Mutation>
    );
  }
}
