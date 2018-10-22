import React, { Component } from "react";
import {
  Header,
  Container,
  Segment,
  Label,
  Loader,
  Divider,
  Button,
  Input
} from "semantic-ui-react";
import { Query } from "react-apollo";
import { contents, MODES } from "./../../components/widgets";
import Icon from "antd/lib/icon";
import { LAST_DRAFT } from "../../gql-schemas";
import CreatePostContext from "../../contexts/CreatePost";
import Responsive from "../../contexts/Responsive";
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
    const { values } = this.state;
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
                content="Close"
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
              <>
                <Content
                  mode={MODES.EDITOR}
                  basic
                  _refNo={_refNo}
                  postRefNo={postRefNo}
                  defaultValues={defaultValues}
                  style={{ padding: 0 }}
                  onValuesChanged={values => {
                    this.setState({ values });
                    onUpdated && onUpdated(values);
                  }}
                >
                  {rProps => {
                    console.log("rProps"); //TRACE
                    console.log(rProps); //TRACE
                    return <div />;
                  }}
                </Content>
                {values && (
                  <Segment secondary basic>
                    <Divider horizontal fitted>
                      Preview
                    </Divider>
                    <Content mode={MODES.COMPACT} defaultValues={values} />
                    <Content mode={MODES.VIEW} defaultValues={values} />
                  </Segment>
                )}
              </>
            )}
          </>
        ) : (
          <Content mode={MODES.COMPACT} defaultValues={values} basic />
        )}
      </Segment>
    );
  }
}
class ActionButtons extends Component {
  state = { showCollection: false, selectedTemplate: null };
  render() {
    const { onSelected, onClick, newContents } = this.props;
    const { showCollection, selectedTemplate } = this.state;
    let PreviewContent;
    if (selectedTemplate) {
      PreviewContent = contents[selectedTemplate].component;
    }
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
                  onClick={() => {
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
          <>
            <Button
              basic
              icon="plus"
              content={`Add ${newContents.length > 0 && "More"} Content`}
              onClick={() => {
                this.setState({ showCollection: true });
                onClick && onClick();
              }}
            />
            <Button
              primary
              disabled
              icon="send"
              content="Post"
              floated="right"
            />
          </>
        )}
      </Segment>
    );
  }
}

export default class CreatePost extends Component {
  state = { activeIndex: 0 };
  render() {
    const { activeIndex } = this.state;
    return (
      <Responsive.Consumer>
        {({ isMobile }) => (
          <Query query={LAST_DRAFT.query}>
            {({ loading, data }) => {
              if (loading) return <Loader inline="centered" active />;
              console.log("data"); //TRACE
              console.log(data); //TRACE
              const post = get(data, "LastDraft.post");
              const newContents = get(post, "widgets", []);
              console.log("newContents"); //TRACE
              console.log(newContents); //TRACE
              return (
                <Container>
                  <Divider hidden />
                  <Header as="h1" dividing>
                    Create Post
                  </Header>
                  <CreatePostContext.Consumer>
                    {({ editPost }) => (
                      <Input
                        size="big"
                        fluid
                        defaultValue={post.title}
                        label={{ basic: true, content: "Title" }}
                        placeholder="What is this about?"
                        onChange={debounce((_, { value }) => {
                          editPost({ _refNo: post._refNo, title: value });
                        }, 1000)}
                      />
                    )}
                  </CreatePostContext.Consumer>
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
                      onUpdated={values => {
                        const updatedContents = [...newContents];
                        updatedContents[ii].values = values;
                        this.setState({ newContents: updatedContents });
                      }}
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
