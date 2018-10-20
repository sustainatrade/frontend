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
  Header,
  Loader
} from "semantic-ui-react";
// import { Query } from "react-apollo";
import WidgetContext from "./../../contexts/WidgetContext";
import PostWidget from "./../post-view/PostWidget";
import SubmitStatus from "./SubmitStatus";
import { GlobalConsumer } from "./../../contexts";
import { sections } from "./../../config";
import { getUrl } from "./../../contexts/PostFeedContext";
import { Link } from "@reach/router";
import loadable from "loadable-components";

const UploadPhoto = loadable(() => import(`./UploadPhoto`), {
  LoadingComponent: () => (
    <div>
      <Loader inline="centered" active />
    </div>
  )
});

const CreateWidget = loadable(() => import(`./CreateWidget`), {
  LoadingComponent: () => (
    <div>
      <Loader inline="centered" active />
    </div>
  )
});

const UPLOAD_NAME = "Post Image Upload";

function tagItem(tag) {
  return {
    key: tag,
    value: tag,
    text: tag
  };
}

function createAddOnsButton({ active, content, ...rest }) {
  return (
    <Button
      type="button"
      basic={!active}
      size="small"
      icon
      labelPosition="left"
      {...rest}
    >
      <Icon name={active ? "minus" : "plus"} />
      {content}
    </Button>
  );
}
export default class ComposePost extends Component {
  state = {
    tagInput: { key: "_", text: "", value: "" },
    mutKey: Date.now(),
    showCreateWidget: false
  };

  renderTags({ form, updateForm }) {
    const { tagInput } = this.state;
    const tags = form.tags || [];

    const stateOptions = tags.map(tag => tagItem(tag)) || [];
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
          this.setState({
            tagInput: { key: "_", text: "", value: "" }
          });
          updateForm({ tags: value });
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
  renderSpecs({
    addWidget,
    widgets,
    editWidget,
    deleteWidget,
    undeleteWidget
  }) {
    return (
      <div>
        <WidgetContext.Consumer>
          {({ selectWidgetFn }) => (
            <React.Fragment>
              <Grid doubling stretched columns={1}>
                {widgets.map((widget, index) => {
                  const widgetProps = {
                    key: widget.key,
                    fluid: true,
                    editable: true,
                    onEdit: data => {
                      editWidget(index, data);
                    },
                    onDelete: () => {
                      deleteWidget(index);
                    }
                  };
                  if (widget._refNo) {
                    widgetProps.fromRefNo = widget._refNo;
                  }
                  widgetProps.data = widget;
                  if (widget.__deleted)
                    return (
                      <Grid.Column key={`post-widget-${index}`}>
                        <Segment>
                          <center>
                            Deleted
                            {` `}
                            {/*eslint-disable-next-line*/}
                            <a onClick={() => undeleteWidget(index)}>Undo</a>
                          </center>
                        </Segment>
                      </Grid.Column>
                    );
                  return (
                    <Grid.Column key={`post-widget-${index}`}>
                      <PostWidget {...widgetProps} />
                    </Grid.Column>
                  );
                })}
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
            <Link to={getUrl(post)}>
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
                  // viewPostFn(post._refNo, post);
                }}
              />
            </Link>
          </center>
        )}
      </GlobalConsumer>
    );
  }
  renderForm = () => (
    <GlobalConsumer>
      {({
        createPost: {
          photos,
          form,
          formErrors,
          loading,
          updateForm,
          modalOpened,
          widgets,
          addWidget,
          editWidget,
          deleteWidget,
          undeleteWidget,
          closeModal,
          submit
        },
        category: { categories },
        uploader: { upload, status, isUploading },
        widget: { submitWidgetsFn }
      }) => {
        let errsx = [],
          options = [];
        if (categories) {
          options = Object.keys(categories).map(catKey => ({
            key: catKey,
            text: categories[catKey],
            value: catKey
          }));
        }
        // console.log("form"); //TRACE
        // console.log(form); //TRACE
        // if (error) {
        //   errsx.push(error.graphQLErrors);
        // }
        if (formErrors.length > 0) {
          errsx.push(...formErrors);
        }
        console.log("errsx"); //TRACE
        console.log(errsx); //TRACE
        if (loading) return <Loader active inline="centered" />;
        return (
          <React.Fragment>
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
            <Form
              onSubmit={async () => {
                console.log("subbmiting.."); //TRACE
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
                console.log("111");

                if (errs.length > 0) {
                  console.log("errs"); //TRACE
                  console.log(errs); //TRACE
                  this.setState({ formErrors: errs });
                  console.log("done");
                  return;
                }
                console.log("1112");
                const path = localStorage.getItem("postPhotoPath");
                submitStatus = this.state.submitStatus;
                submitStatus.steps.s1.done = true;
                submitStatus.steps.s1.loading = false;
                submitStatus.steps.s2.loading = true;
                await this.setState({ submitStatus });
                console.log("1113");
                // const [photoResponse] = await Promise.all([
                //   Promise.resolve(["sdfsdf.jps"]),
                //   sleep(200)
                // ]);
                const photoResponse = await upload({
                  name: UPLOAD_NAME,
                  path,
                  files: photos || []
                });
                submitStatus = this.state.submitStatus;
                submitStatus.steps.s2.done = true;
                submitStatus.steps.s2.loading = false;
                submitStatus.steps.s3.loading = true;
                await this.setState({ submitStatus });
                // const [newPost] = await Promise.all([
                //   Promise.resolve({
                //     _refNo: "POST-0000033"
                //   }),
                //   sleep(200)
                // ]);
                const newPost = await submit(
                  Object.assign({}, form, { photos: photoResponse })
                );
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
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Section</label>
                  <Button.Group fluid>
                    {sections.map((section, ii) => (
                      <React.Fragment key={section.key}>
                        {ii > 0 && <Button.Or />}
                        <Button
                          color={
                            form.section === section.key
                              ? section.color
                              : undefined
                          }
                          type="button"
                          onClick={() => updateForm({ section: section.key })}
                        >
                          {section.displayName}
                        </Button>
                      </React.Fragment>
                    ))}
                  </Button.Group>
                </Form.Field>
                <Form.Field required>
                  <label>Category</label>
                  <Form.Select
                    options={options}
                    placeholder="Select Category"
                    loading={loading}
                    value={form.category}
                    onChange={(e, { value }) => updateForm({ category: value })}
                    required
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field
                control={Input}
                label="Title"
                placeholder="Title"
                required
                value={form.title || ""}
                onChange={(e, { value }) => updateForm({ title: value })}
              />

              <Form.Field
                control={TextArea}
                label="Description (Summary)"
                placeholder="Description"
                value={form.description || ""}
                onChange={(e, { value }) => updateForm({ description: value })}
                required
              />
              <Divider />
              {createAddOnsButton({
                content: "Tags",
                active: this.state.showTags,
                onClick: () => {
                  this.setState(({ showTags }) => {
                    return { showTags: !showTags };
                  });
                }
              })}
              {createAddOnsButton({
                content: "Photos",
                active: this.state.showPhotos,
                onClick: () => {
                  this.setState(({ showPhotos }) => {
                    return { showPhotos: !showPhotos };
                  });
                }
              })}
              {createAddOnsButton({
                content: "Specs",
                active: this.state.showSpecs,
                onClick: () => {
                  this.setState(({ showSpecs }) => {
                    return { showSpecs: !showSpecs };
                  });
                }
              })}
              <Divider horizontal />
              {this.state.showTags && (
                <React.Fragment>
                  <Divider horizontal>Tags</Divider>
                  {this.renderTags({ form, updateForm })}
                </React.Fragment>
              )}
              {this.state.showPhotos && (
                <React.Fragment>
                  <Divider horizontal>Photos</Divider>
                  <UploadPhoto defaultPhotos={form.photos} />
                </React.Fragment>
              )}
              {this.state.showSpecs && (
                <React.Fragment>
                  <Divider horizontal>Specs</Divider>
                  <CreateWidget />
                </React.Fragment>
              )}
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
          </React.Fragment>
        );
      }}
    </GlobalConsumer>
  );
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
