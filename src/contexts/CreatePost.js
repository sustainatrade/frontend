import React from "react";
import set from "lodash/set";
import gql from "graphql-tag";
import apolloClient from "./../lib/apollo";

const Context = React.createContext();

const CREATE_POST = gql`
  mutation($post: CreatePostInput) {
    CreatePost(input: $post) {
      status
      post {
        id
        title
        section
        category
        description
        _refNo
      }
    }
  }
`;

class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpened: false,
      widgets: [],
      closeModal: () => {
        this.setState({ modalOpened: false });
      },
      openModal: () => {
        this.setState({ modalOpened: true });
      },
      setPhotos: photos => {
        this.setState({ photos });
      },
      addWidget: async widgetData => {
        this.setState({ widgets: [...this.state.widgets, widgetData] });
      },
      editWidget: (index, data) => {
        const { widgets } = this.state;
        this.setState({ widgets: set(widgets, index, data) });
      },
      submit: async post => {

        try {
          const ret = await apolloClient.mutate({
            mutation: CREATE_POST,
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
