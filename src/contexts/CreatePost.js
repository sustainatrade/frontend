import React from "react";
import set from "lodash/set";
import * as gql from "./../gql-schemas";
import apolloClient from "./../lib/apollo";
import nanoid from "nanoid";

const Context = React.createContext();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: nanoid(),
      modalOpened: false,
      widgets: [],
      loading: false,
      form: {},
      formErrors: [],
      updateForm(newProps) {
        const { form } = this.state;
        const newForm = Object.assign({}, form, newProps);
        this.setState({ form: newForm, formErrors: [] });
      },
      closeModal: () => {
        this.setState({ modalOpened: false });
      },
      openModal: async refNo => {
        let loading = refNo ? true : false;

        this.setState({ modalOpened: true, key: nanoid(), loading });
        if (!refNo) {
          return;
        }
        const ret = await apolloClient.query({
          query: gql.GET_POST,
          variables: { _refNo: refNo },
          options: {
            fetchPolicy: "network-only"
          }
        });
        await sleep(1000);
        if (ret.data.Post.status === "SUCCESS") {
          this.setState({
            form: ret.data.Post.post,
            loading: false
          });
        } else {
          this.setState({ loading: false });
        }
      },
      setPhotos: photos => {
        this.setState({ photos });
      },
      addWidget: async widgetData => {
        widgetData.key = nanoid();
        this.setState({ widgets: [...this.state.widgets, widgetData] });
      },
      editWidget: (index, data) => {
        const { widgets } = this.state;
        this.setState({
          widgets: set(widgets, index, Object.assign(data, { key: nanoid() }))
        });
      },
      editPost: async post => {
        try {
          const ret = await apolloClient.mutate({
            mutation: gql.EDIT_POST,
            variables: post
          });
          const { CreatePost } = ret.data;
          return CreatePost.post;
        } catch (err) {
          console.log("error");
          console.log(err);
        }
      },
      submit: async post => {
        try {
          const ret = await apolloClient.mutate({
            mutation: gql.CREATE_POST,
            variables: post
          });
          const { CreatePost } = ret.data;
          return CreatePost.post;
        } catch (err) {
          console.log("err");
          console.log(err);
          console.log("error");
        }
      }
    };
  }
  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default {
  Provider,
  Consumer: Context.Consumer
};
