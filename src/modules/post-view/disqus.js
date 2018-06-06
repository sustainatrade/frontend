import React, { Component } from 'react'
// import Disqus from 'disqus-react';

const DISQUS_SHORTNAME = 'sustainatrade';

export class DisQusDiscussion extends Component {
    render() {
        const { post } = this.props;
        const disqusConfig = {
            url: `https://sustainatrade.com/posts/${post._refNo}`,
            identifier: post._refNo,
            title: post.title,
        };
 
        return (
            <div></div>
                // <Disqus.DiscussionEmbed shortname={DISQUS_SHORTNAME} config={disqusConfig} />
        );
    }
}

export class DisQusCommentCount extends Component {
    render() {
        const { post } = this.props;
        const disqusConfig = {
            url: `https://sustainatrade.com/posts/${post._refNo}`,
            identifier: post._refNo,
            title: post.title,
        };
        return <div/>
        // return (<Disqus.CommentCount key={post._refNo} shortname={DISQUS_SHORTNAME} config={disqusConfig} />);
    }
}

