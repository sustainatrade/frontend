import React, { Component } from "react";
import {
  Segment,
  Button,
  Icon,
  Form,
  Grid,
  Input,
  Message,
  TextArea,
  Dropdown,
  Divider,
  Header
} from "semantic-ui-react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import WidgetContext from "./../../contexts/WidgetContext";
import UploadPhoto from "./UploadPhoto";
import PostWidget from "./../post-view/PostWidget";
import SubmitStatus from "./SubmitStatus";
import { GlobalConsumer } from "./../../contexts";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const CATEGORY_LIST = gql`
  query {
    CategoryList {
      list {
        id
        name
      }
    }
  }
`;

const UPLOAD_NAME = "Post Image Upload";

function tagItem(tag) {
  return {
    key: tag,
    value: tag,
    text: tag
  };
}
export default class ComposePost extends Component {
  state = {
    form: {},
    formErrors: [],
    tagInput: { key: "_", text: "", value: "" },
    mutKey: Date.now()
  };

  updateForm(newProps) {
    const { form } = this.state;
    const newForm = Object.assign({}, form, newProps);
    // newForm._hash =
    // console.log('newForm')//TRACE
    // console.log(newForm)//TRACE
    this.setState({ form: newForm, formErrors: [] });
  }

  renderTags() {
    const { form, tagInput } = this.state;
    const tags = form.tags || [];

    const stateOptions = tags.map(tag => tagItem(tag)) || [];
    // if(stateOptions.length>0)
    if (tagInput.value.length > 0) stateOptions.unshift(tagInput);

    return (
      <Dropdown
        placeholder="Enter Tag"
        fluid
        multiple
        search
        selection
        value={tags}
        onChange={(e, { value }) => {
          const newForm = Object.assign({}, form, { tags: value });
          this.setState({
            form: newForm,
            tagInput: { key: "_", text: "", value: "" }
          });
        }}
        onSearchChange={(e, data) => {
          let tmp = { key: "_", text: "", value: "" };
          if (e.target.value.length > 2) tmp = tagItem(e.target.value);

          this.setState({ tagInput: tmp });
        }}
        options={stateOptions}
      />
    );
  }
  renderSpecs({ addWidget, widgets, editWidget }) {
    return (
      <div>
        <WidgetContext.Consumer>
          {({ selectWidgetFn }) => (
            <React.Fragment>
              <Grid doubling stretched columns={1}>
                {widgets.map((widget, index) => (
                  <Grid.Column key={`post-widget-${index}`}>
                    <PostWidget
                      fromData={widget}
                      fluid
                      onEdit={data => {
                        editWidget(index, data);
                      }}
                      editable
                    />
                  </Grid.Column>
                ))}
              </Grid>
              <Segment
                compact
                textAlign="center"
                className="ant-upload ant-upload-select-picture-card"
                style={{ width: 104, height: 104 }}
                onClick={async () => {
                  const widgetData = await selectWidgetFn();
                  console.log("add widget");

                  if (widgetData) addWidget(widgetData);
                }}
              >
                <Icon.Group size="huge">
                  <Icon name="window restore outline" />
                  <Icon corner name="add" />
                </Icon.Group>
                <div>Add Spec</div>
              </Segment>
            </React.Fragment>
          )}
        </WidgetContext.Consumer>
      </div>
    );
  }
  renderViewPost(post) {
    return (
      <GlobalConsumer>
        {({ createPost: { closeModal }, postView: { viewPostFn } }) => (
          <center>
            <Button
              content="View Post"
              icon="eye"
              color="green"
              onClick={() => {
                this.setState({
                  form: {},
                  formErrors: [],
                  mutKey: Date.now()
                });
                closeModal();
                viewPostFn(post._refNo);
              }}
            />
          </center>
        )}
      </GlobalConsumer>
    );
  }
  renderForm() {
    const { formErrors, form, loading } = this.state;
    const errsx = [];
    // if (error) {
    //   errsx.push(error.graphQLErrors);
    // }
    if (formErrors.length > 0) {
      errsx.push(...formErrors);
    }
    return (
      <div>
        {errsx.length > 0 && (
          <Message warning>
            <Message.Header>New Site Features</Message.Header>
            <Message.List>
              {errsx.map((message, i) => (
                <Message.Item key={i}>{message}</Message.Item>
              ))}
            </Message.List>
          </Message>
        )}
        <GlobalConsumer>
          {({
            createPost: {
              photos,
              modalOpened,
              widgets,
              addWidget,
              editWidget,
              closeModal,
              submit
            },
            uploader: { upload, status, isUploading },
            widget: { submitWidgetsFn }
          }) => (
            <Form
              onSubmit={async () => {
                console.log("subbmiting.."); //TRACE
                const { form } = this.state;
                let submitStatus = {
                  steps: {
                    s1: {
                      description: "Field validation",
                      loading: true
                    },
                    s2: {
                      description: "Photo Upload"
                    },
                    s3: {
                      description: "Submit details"
                    },
                    s4: {
                      description: "Update specs"
                    }
                  }
                };
                await this.setState({
                  loading: true,
                  submitStatus
                });

                const errs = [];
                ["title", "description", "section", "category"].forEach(f => {
                  if (!form[f]) {
                    errs.push(`"${f}" should not be empty`);
                  }
                });
                if (errs.length > 0) {
                  this.setState({ formErrors: errs });
                  return;
                }
                const path = localStorage.getItem("postPhotoPath");
                submitStatus = this.state.submitStatus;
                submitStatus.steps.s1.done = true;
                submitStatus.steps.s1.loading = false;
                submitStatus.steps.s2.loading = true;
                await this.setState({ submitStatus });
                const [photoResponse] = await Promise.all([
                  Promise.resolve(["sdfsdf.jps"]),
                  sleep(200)
                ]);
                // const photoResponse = await upload({
                //   name: UPLOAD_NAME,
                //   path,
                //   files: photos
                // });
                submitStatus = this.state.submitStatus;
                submitStatus.steps.s2.done = true;
                submitStatus.steps.s2.loading = false;
                submitStatus.steps.s3.loading = true;
                await this.setState({ submitStatus });
                const [newPost] = await Promise.all([
                  Promise.resolve({
                    _refNo: "POST-0000033"
                  }),
                  sleep(200)
                ]);
                // const newPost = await submit({
                //   post: Object.assign({}, form, { photos: photoResponse })
                // });
                console.log("newPost");
                console.log(newPost);
                submitStatus = this.state.submitStatus;
                submitStatus.steps.s3.done = true;
                submitStatus.steps.s3.loading = false;
                submitStatus.steps.s4.loading = true;
                await this.setState({ submitStatus });
                const taggedWidgets = widgets.map(widget => {
                  widget.postRefNo = newPost._refNo;
                  return widget;
                });
                await submitWidgetsFn(taggedWidgets);
                submitStatus.steps.s4.done = true;
                submitStatus.steps.s4.loading = false;
                await this.setState({
                  loading: false,
                  submitStatus,
                  post: newPost
                });
              }}
            >
              <Form.Field
                control={Input}
                label="Title"
                placeholder="Title"
                required
                value={form.title || ""}
                onChange={(e, { value }) => this.updateForm({ title: value })}
              />
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Section</label>
                  <Button.Group fluid>
                    <Button
                      positive={form.section === "buy"}
                      type="button"
                      onClick={() => this.updateForm({ section: "buy" })}
                    >
                      Buy
                    </Button>
                    <Button.Or />
                    <Button
                      positive={form.section === "sell"}
                      type="button"
                      onClick={() => this.updateForm({ section: "sell" })}
                    >
                      Sell
                    </Button>
                  </Button.Group>
                </Form.Field>
                <Form.Field required>
                  <label>Category</label>
                  <Query query={CATEGORY_LIST}>
                    {({ loading, error, data = {} }) => {
                      const { CategoryList } = data;
                      let options = [];
                      if (CategoryList) {
                        options = CategoryList.list.map(cat => ({
                          key: cat.id,
                          text: cat.name,
                          value: cat.id
                        }));
                      }
                      return (
                        <Form.Select
                          options={options}
                          placeholder="Select Category"
                          loading={loading}
                          onChange={(e, { value }) =>
                            this.updateForm({ category: value })
                          }
                          required
                        />
                      );
                    }}
                  </Query>
                </Form.Field>
              </Form.Group>
              <Form.Field
                control={TextArea}
                label="Description"
                placeholder="Description"
                value={form.description || ""}
                onChange={(e, { value }) =>
                  this.updateForm({ description: value })
                }
                required
              />
              <Divider horizontal>Tags</Divider>
              {this.renderTags()}
              <Divider horizontal>Photos</Divider>
              <UploadPhoto />
              <Divider horizontal>Specs</Divider>
              {this.renderSpecs({ addWidget, widgets, editWidget })}
              <Divider />
              <div style={{ textAlign: "right" }}>
                <Button
                  type="button"
                  content="Cancel"
                  icon="x"
                  loading={loading || isUploading(UPLOAD_NAME)}
                  disabled={loading || isUploading(UPLOAD_NAME)}
                  onClick={closeModal}
                />
                <Button
                  type="submit"
                  color="black"
                  loading={loading || isUploading(UPLOAD_NAME)}
                  disabled={loading || isUploading(UPLOAD_NAME)}
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </GlobalConsumer>
      </div>
    );
  }
  render() {
    return (
      <Segment basic>
        <Header as="h2">
          <Icon name="compose" />
          <Header.Content>
            {this.state.submitStatus ? "Submitting" : "Compose"} Post
          </Header.Content>
        </Header>
        <Divider />
        {!this.state.submitStatus && this.renderForm()}
        {this.state.submitStatus && (
          <SubmitStatus {...this.state.submitStatus} />
        )}
        {this.state.post && this.renderViewPost(this.state.post)}
      </Segment>
    );
  }
}
