import React, { Component } from "react";
import {
  Header,
  Container,
  Segment,
  Label,
  Loader,
  Divider,
  Popup,
  Button,
  Input
} from "semantic-ui-react";
import { Query } from "react-apollo";
import { contents, MODES } from "./../../components/widgets";
import Icon from "antd/lib/icon";
import { LAST_DRAFT, PUBLISH_POST } from "../../gql-schemas";
import CreatePostContext from "../../contexts/CreatePost";
import ErrorContext from "../../contexts/ErrorContext";
import Responsive from "../../contexts/Responsive";
import PostWidgetContext from "../../contexts/WidgetContext";
import { GlobalConsumer } from "../../contexts";
import get from "lodash/get";
import debounce from "lodash/debounce";
import "./create-post.css";

class NewContent extends Component {
  state = { values: null };
  render() {
    const {
      mobile,
      contentKey,
      active,
      onClick,
      onDelete,
      onClose,
      defaultValues,
      onUpdated,
      postRefNo,
      _refNo,
      index
    } = this.props;
    const Content = contents[contentKey].component;
    const style = mobile ? { paddingLeft: 0, paddingRight: 0 } : {};
    if (!active) {
      style.cursor = "pointer";
    }
    return (
      <Segment
        color="grey"
        basic
        onClick={onClick}
        style={style}
        className={active ? "" : "new-post-inactive"}
      >
        {active ? (
          <>
            <div>
              <b>Create Content</b>{" "}
              <Button
                icon="angle up"
                basic
                color="black"
                size="mini"
                floated="right"
                onClick={() => {
                  onClose && onClose(index);
                }}
              />
            </div>
            {contentKey && (
              <ErrorContext.Consumer>
                {error => (
                  <>
                    <Content
                      mode={MODES.EDITOR}
                      basic
                      _refNo={_refNo}
                      postRefNo={postRefNo}
                      defaultValues={defaultValues}
                      style={{ padding: 0 }}
                      onValuesChanged={values => {
                        error.clear(PUBLISH_POST.key);
                      }}
                    >
                      {rProps => {
                        console.log("rProps"); //TRACE
                        console.log(rProps); //TRACE
                        return <div />;
                      }}
                    </Content>
                  </>
                )}
              </ErrorContext.Consumer>
            )}
          </>
        ) : (
          <Content mode={MODES.COMPACT} defaultValues={defaultValues} basic />
        )}
      </Segment>
    );
  }
}
class ActionButtons extends Component {
  state = { showCollection: false, selectedTemplate: null };
  render() {
    const { onSelected, onClick, newContents, postRefNo } = this.props;
    const { showCollection, selectedTemplate } = this.state;
    let PreviewContent;
    if (selectedTemplate) {
      PreviewContent = contents[selectedTemplate].component;
    }
    return (
      <PostWidgetContext.Consumer>
        {context => {
          return (
            <Segment color="blue" basic>
              {showCollection ? (
                <React.Fragment>
                  <Header>
                    Select Content{" "}
                    <Button
                      floated="right"
                      size="mini"
                      content="Cancel"
                      icon="ban"
                      onClick={() =>
                        this.setState({
                          showCollection: false,
                          selectedTemplate: null
                        })
                      }
                    />
                  </Header>
                  {Object.keys(contents).map(tCode => {
                    const content = contents[tCode];
                    console.log("template"); //TRACE
                    console.log(content); //TRACE
                    const isSelected = tCode === selectedTemplate;
                    return (
                      <Button
                        key={tCode}
                        basic={!isSelected}
                        color="green"
                        onClick={() => {
                          this.setState({ selectedTemplate: tCode });
                        }}
                      >
                        <Icon {...content.icon} /> {content.name}
                      </Button>
                    );
                  })}
                  {selectedTemplate && (
                    <React.Fragment>
                      <Segment secondary basic>
                        <Divider horizontal fitted>
                          Preview
                        </Divider>
                        <PreviewContent mode={MODES.COMPACT} preview />
                        <PreviewContent mode={MODES.VIEW} preview />
                      </Segment>
                      <Button
                        floated="right"
                        content="Continue"
                        primary
                        icon="arrow right"
                        labelPosition="right"
                        onClick={async () => {
                          await context.submitWidgetsFn([
                            {
                              code: selectedTemplate,
                              postRefNo,
                              values: {}
                            }
                          ]);
                          onSelected && onSelected(selectedTemplate);
                          this.setState({
                            selectedTemplate: null,
                            showCollection: false
                          });
                        }}
                      />
                      <Divider clearing hidden fitted />
                    </React.Fragment>
                  )}
                </React.Fragment>
              ) : (
                <GlobalConsumer>
                  {({ createPost: { publishPost }, error }) => {
                    console.log("error"); //TRACE
                    console.log(error); //TRACE
                    const publishPostErrors = get(
                      error,
                      [PUBLISH_POST.key],
                      []
                    );
                    return (
                      <>
                        <Button
                          basic
                          icon="plus"
                          content={`Add ${
                            newContents.length > 0 ? "More" : ""
                          } Content`}
                          onClick={() => {
                            this.setState({ showCollection: true });
                            onClick && onClick();
                          }}
                        />
                        <Popup
                          open={publishPostErrors.length > 0}
                          content={
                            <>
                              {publishPostErrors.map((err, ii) => (
                                <div key={ii}>{err.message}</div>
                              ))}
                            </>
                          }
                          trigger={
                            <Button
                              primary
                              icon="send"
                              content="Post"
                              floated="right"
                              onClick={() => {
                                error.clear(PUBLISH_POST.key);
                                // this.setState({ showCollection: true });
                                publishPost({ refNo: postRefNo });
                              }}
                            />
                          }
                        />
                      </>
                    );
                  }}
                </GlobalConsumer>
              )}
            </Segment>
          );
        }}
      </PostWidgetContext.Consumer>
    );
  }
}

export default class CreatePost extends Component {
  state = { activeIndex: null };
  render() {
    const { activeIndex } = this.state;
    return (
      <Responsive.Consumer>
        {({ isMobile }) => (
          <Query query={LAST_DRAFT.query}>
            {({ loading, data }) => {
              console.log("data"); //TRACE
              console.log(data); //TRACE
              const post = get(data, "LastDraft.post");
              const newContents = get(post, "widgets", []);
              console.log("post"); //TRACE
              console.log(post); //TRACE
              // activeIdx === undefined ? newContents.length - 1 : activeIdx;
              if (!post) return <Loader inline="centered" active />;
              return (
                <Container>
                  <Divider hidden />
                  <Header as="h1" dividing>
                    Create Post
                  </Header>
                  <GlobalConsumer>
                    {({ createPost: { editPost }, error }) => (
                      <Input
                        size="big"
                        fluid
                        defaultValue={post.title}
                        label={{ basic: true, content: "Title" }}
                        style={{
                          borderStyle: "double",
                          borderColor: "gainsboro"
                        }}
                        placeholder="What is this about?"
                        onChange={debounce((_, { value }) => {
                          error.clear(PUBLISH_POST.key);
                          editPost({ _refNo: post._refNo, title: value });
                        }, 1000)}
                      />
                    )}
                  </GlobalConsumer>
                  {newContents.map((content, ii) => (
                    <NewContent
                      mobile={isMobile}
                      key={ii}
                      index={ii}
                      _refNo={content._refNo}
                      postRefNo={post._refNo}
                      contentKey={content.code}
                      defaultValues={content.values}
                      active={ii === activeIndex}
                      onUpdated={values => {}}
                      onClose={() => this.setState({ activeIndex: null })}
                      onDelete={index => {
                        const filteredContents = newContents.filter(
                          (_, i) => i !== index
                        );
                        this.setState({ newContents: filteredContents });
                      }}
                      onClick={() =>
                        ii !== activeIndex && this.setState({ activeIndex: ii })
                      }
                    />
                  ))}
                  <ActionButtons
                    mobile={isMobile}
                    postRefNo={post._refNo}
                    newContents={newContents}
                    onClick={() => this.setState({ activeIndex: null })}
                    onSelected={contentKey => {
                      const updatedContents = [
                        ...newContents,
                        { code: contentKey }
                      ];
                      this.setState({
                        newContents: updatedContents,
                        activeIndex: updatedContents.length - 1
                      });
                    }}
                  />
                  <Divider hidden />
                </Container>
              );
            }}
          </Query>
        )}
      </Responsive.Consumer>
    );
  }
}
