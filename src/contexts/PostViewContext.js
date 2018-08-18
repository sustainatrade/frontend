import React from "react";
import * as gql from "../gql-schemas";
import apolloClient from "../lib/apollo";
import { history } from "./../lib/history";
import Modal from "antd/lib/modal";
import { Form } from "semantic-ui-react";
import Notification from "antd/lib/notification";
import ls from "lscache";

const Context = React.createContext();
const { Consumer } = Context;

export const VIEW_MODES = {
  compact: `compact`,
  card: `card`,
  tiled: `tiled`
};

class ReportPost extends React.Component {
  state = {};
  types = {
    INAPPROPRIATE: "Inappropriate",
    SPAM: "Spam",
    OTHERS: "Others:"
  };

  handleChange = (_, data) => {
    if (data.checked) {
      const { reportPost = {} } = this.state;
      this.setState({ reportPost: { ...reportPost, type: data.value } });
    }
  };
  render() {
    const { postRefNo, onCompleted, ...modalProps } = this.props;
    const { reportPost = {}, detail } = this.state;
    const { OTHERS, ...typeOptions } = this.types;
    return (
      <Modal
        {...modalProps}
        title={`Report Post ${postRefNo}`}
        okText="Submit"
        onOk={() => {
          apolloClient.mutate({
            mutation: gql.REPORT_POST,
            variables: {
              postRefNo,
              detail
            }
          });
          Notification.info({
            message: "Report has been submitted!"
          });
          onCompleted && onCompleted();
        }}
      >
        <Form>
          <Form.Group>
            <label>Problem:</label>
            {Object.keys(typeOptions).map(type => (
              <Form.Radio
                key={"rp-" + type}
                label={typeOptions[type]}
                value={type}
                checked={reportPost.type === type}
                onChange={this.handleChange}
              />
            ))}
            <Form.Radio
              label={OTHERS}
              value="OTHERS"
              checked={reportPost.type === "OTHERS"}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.TextArea
            placeholder="Tell us what's wrong"
            onChange={(_, data) => this.setState({ detail: data.value })}
          />
        </Form>
      </Modal>
    );
  }
}

class Provider extends React.Component {
  state = {
    postViewMode: ls.get("post-view-mode"),
    setPostViewMode: postViewMode => {
      ls.set("post-view-mode", postViewMode);
      this.setState({ postViewMode });
    },
    closeFn: () => {
      this.setState({ post: undefined });
    },
    addWidgetFn: widgetRefNo => {
      const { widgets = [] } = this.state;
      this.setState({ widgets: [...widgets, widgetRefNo] });
    },
    viewPostFn: async _refNo => {
      const self = this;
      if (this.state.loading) return;
      self.setState({ loading: true, loadingRefNo: _refNo });

      const ret = await apolloClient.query({
        query: gql.GET_POST,
        variables: { _refNo },
        options: {
          fetchPolicy: "network-only"
        }
      });
      if (ret.data.Post.status === "SUCCESS") {
        self.setState({
          post: ret.data.Post.post,
          widgets: ret.data.Post.widgets,
          loading: undefined,
          loadingRefNo: undefined
        });
      } else {
        self.setState({ loading: undefined, loadingRefNo: undefined });
      }
    },
    reportPostFn: async refNo => {
      this.setState({ reportPostRefNo: refNo });
    },
    removePostFn: async (refNo, reason) => {
      await apolloClient.mutate({
        mutation: gql.REMOVE_POST,
        variables: {
          postRefNo: refNo,
          detail: "deleted"
        }
      });
      Notification.info({
        message: "Post has been removed!"
      });
    }
  };

  parseLocation = (location, action) => {
    const { viewPostFn, closeFn } = this.state;
    const paths = location.pathname.split("/");
    const route = paths[1];
    const postRefNo = paths[3];
    if (route === "posts" && postRefNo) {
      viewPostFn(postRefNo);
    } else {
      closeFn();
    }
  };
  //TESTING
  componentDidMount() {
    this.parseLocation(history.location);
    history.listen((location, action) => {
      console.log(action, location.pathname, location.state);
      this.parseLocation(location);
    });
    const { postViewMode, setPostViewMode } = this.state;
    if (!postViewMode) {
      setPostViewMode(VIEW_MODES.compact);
    }
  }

  render() {
    const { children } = this.props;
    const { reportPostRefNo } = this.state;
    return (
      <Context.Provider value={this.state}>
        {children}
        <ReportPost
          postRefNo={reportPostRefNo}
          visible={!!reportPostRefNo}
          onCancel={() => this.setState({ reportPostRefNo: undefined })}
          onCompleted={() => this.setState({ reportPostRefNo: undefined })}
        />
      </Context.Provider>
    );
  }
}

export default {
  Provider,
  Consumer
};
