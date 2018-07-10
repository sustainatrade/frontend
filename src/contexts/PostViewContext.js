import React from "react";
import * as gql from "./../gql-schemas";
import apolloClient from "./../lib/apollo";
import Modal from "antd/lib/modal";
import { Form } from "semantic-ui-react";

const Context = React.createContext();
const { Consumer } = Context;

class ReportPost extends React.Component {
  state = {};
  types = {
    INAPPROPRIATE: "Inappropriate",
    SPAM: "Spam",
    OTHERS: "Others:"
  };
  handleChange = (_, data) => {
    console.log("a,b"); //TRACE
    if (data.checked) {
      const { reportPost = {} } = this.state;
      this.setState({ reportPost: { ...reportPost, type: data.value } });
    }
  };
  render() {
    const { postRefNo, ...modalProps } = this.props;
    const { reportPost = {} } = this.state;
    const { OTHERS, ...typeOptions } = this.types;
    return (
      <Modal {...modalProps} title={`Report Post ${postRefNo}`} okText="Submit">
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
          <Form.TextArea placeholder="Tell us what's wrong" />
        </Form>
      </Modal>
    );
  }
}

class Provider extends React.Component {
  state = {
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
      self.setState({ loading: true });

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
          loading: undefined
        });
      } else {
        self.setState({ loading: undefined });
      }
    },
    reportPostFn: async refNo => {
      this.setState({ reportPostRefNo: refNo });
    }
  };

  //TESTING
  componentDidMount() {
    // this.state.viewPostFn('POST-0000016')
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
        />
      </Context.Provider>
    );
  }
}

export default {
  Provider,
  Consumer
};
