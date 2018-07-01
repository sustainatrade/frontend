import React from "react";
import set from "lodash/set";
import get from "lodash/get";
import pullAt from "lodash/pullAt";
import * as gql from "./../gql-schemas";
import apolloClient from "./../lib/apollo";
import nanoid from "nanoid";

const Context = React.createContext();
const PHOTO_PATH = localStorage.getItem("postPhotoPath");
const STORAGE = localStorage.getItem("storage");
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
      updateForm: newProps => {
        const { form } = this.state;
        const newForm = Object.assign({}, form, newProps);
        this.setState({ form: newForm, formErrors: [] });
      },
      closeModal: () => {
        this.setState({ modalOpened: false });
      },
      openModal: async refNo => {
        let loading = refNo ? true : false;
        console.log("openeing modall creat"); //TRACE
        this.setState({
          modalOpened: true,
          form: {},
          photos: [],
          widgets: [],
          key: nanoid(),
          loading
        });
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
          const form = ret.data.Post.post;
          const widgetIds = ret.data.Post.widgets || [];
          this.setState({
            form,
            photos: form.photos.map((p, ii) => ({
              uid: `-${ii}`,
              name: p,
              status: "done",
              url: `${STORAGE}${PHOTO_PATH}/${p}`
            })),
            widgets: widgetIds.map(wId => ({ _refNo: wId })),
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
      undeleteWidget: index => {
        const { widgets } = this.state;
        const oldWidget = get(widgets, index, {});
        if (!oldWidget._refNo) {
          this.setState({
            widgets: pullAt(widgets, [index])
          });
        } else
          this.setState({
            widgets: set(
              widgets,
              index,
              Object.assign(oldWidget, { __deleted: undefined })
            )
          });
      },
      deleteWidget: index => {
        const { widgets } = this.state;
        const oldWidget = get(widgets, index, {});
        this.setState({
          widgets: set(
            widgets,
            index,
            Object.assign(oldWidget, { __deleted: true })
          )
        });
      },
      editWidget: (index, data) => {
        const { widgets } = this.state;
        const oldWidget = get(widgets, index, {});
        this.setState({
          widgets: set(
            widgets,
            index,
            Object.assign(oldWidget, data, { key: nanoid() })
          )
        });
      },
      editPost: async ({
        _refNo,
        title,
        section,
        category,
        description,
        photos,
        tags
      }) => {
        try {
          console.log("editting.");
          const ret = await apolloClient.mutate({
            mutation: gql.EDIT_POST,
            variables: {
              post: {
                _refNo,
                title,
                section,
                category,
                description,
                photos,
                tags
              }
            }
          });
          const { EditPost } = ret.data;
          return EditPost.post;
        } catch (err) {
          console.log("error");
          console.log(err);
        }
      },
      submit: async post => {
        console.log("submitt"); //TRACE
        if (post._refNo) return this.state.editPost(post);
        try {
          const ret = await apolloClient.mutate({
            mutation: gql.CREATE_POST,
            variables: {
              post
            }
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
