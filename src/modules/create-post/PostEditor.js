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
import ContentDropdown from "./ContentDropdown";
import "./create-post.css";

class ContentEditor extends Component {
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
    const style = { paddingLeft: 0, paddingRight: 0 };
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
              Create <b>{contents[contentKey].name}</b>{" "}
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
          <Content
            mode={MODES.COMPACT}
            defaultValues={defaultValues}
            basic
            fitted
          />
        )}
      </Segment>
    );
  }
}
class ActionButtons extends Component {
  state = { showCollection: false, selectedTemplate: null };
  render() {
    const { onAdded, postRefNo, post } = this.props;
    const { selectedTemplate } = this.state;

    return (
      <GlobalConsumer>
        {({
          widget: context,
          responsive: { isMobile },
          createPost: { publishPost },
          error
        }) => {
          const publishPostErrors = get(error, [PUBLISH_POST.key], []);
          return (
            <Segment color="blue" basic>
              <>
                <ContentDropdown
                  compact={isMobile}
                  onChange={code => this.setState({ selectedTemplate: code })}
                />
                {selectedTemplate && (
                  <Button.Group>
                    <Button
                      content={!isMobile ? "Preview" : undefined}
                      icon="eye"
                      basic
                      color="grey"
                    />
                    <Button
                      basic
                      content={!isMobile ? "Create" : undefined}
                      icon="edit"
                      color="green"
                      onClick={async () => {
                        await context.submitWidgetsFn([
                          {
                            code: selectedTemplate,
                            postRefNo,
                            values: {}
                          }
                        ]);
                        onAdded && onAdded();
                      }}
                    />
                  </Button.Group>
                )}
                {/* <Button
                          basic
                          icon="plus"
                          content={`Add ${
                            newContents.length > 0 ? "More" : ""
                          } Content`}
                          onClick={() => {
                            this.setState({ showCollection: true });
                            onClick && onClick();
                          }}
                        /> */}
                {!post.publishDate && (
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
                )}
              </>
            </Segment>
          );
        }}
      </GlobalConsumer>
    );
  }
}

const TitleEditor = React.memo(({ title, refNo }) => (
  <GlobalConsumer>
    {({ createPost: { editPost }, error }) => (
      <Input
        key={refNo}
        size="big"
        fluid
        defaultValue={title}
        label={{ basic: true, content: "Title" }}
        style={{
          borderStyle: "double",
          borderColor: "gainsboro"
        }}
        placeholder="What is this about?"
        onChange={debounce((_, { value }) => {
          error.clear(PUBLISH_POST.key);
          editPost({ _refNo: refNo, title: value });
        }, 1000)}
      />
    )}
  </GlobalConsumer>
));

export default class PostEditor extends React.Component {
  state = { activeIndex: null };
  componentDidMount() {
    const { post } = this.props;
    const lastIdx = get(post, "widgets.length", 1);
    this.setState({ activeIndex: lastIdx - 1 });
  }
  render() {
    const { post } = this.props;
    const { activeIndex } = this.state;
    const newContents = post.widgets || [];
    return (
      <Responsive.Consumer>
        {({ isMobile }) => (
          <Container>
            <TitleEditor title={post.title} refNo={post._refNo} />
            {newContents.map((content, ii) => (
              <ContentEditor
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
                onClick={() =>
                  ii !== activeIndex && this.setState({ activeIndex: ii })
                }
              />
            ))}
            <ActionButtons
              mobile={isMobile}
              postRefNo={post._refNo}
              post={post}
              newContents={newContents}
              onClick={() => this.setState({ activeIndex: null })}
              onAdded={() => {
                this.setState({
                  activeIndex: newContents.length
                });
              }}
            />
            <Divider hidden />
          </Container>
        )}
      </Responsive.Consumer>
    );
  }
}
