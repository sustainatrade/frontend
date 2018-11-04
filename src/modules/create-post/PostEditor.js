import React, {
  Component,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo
} from "react";
import {
  Header,
  Container,
  Segment,
  Label,
  Loader,
  Divider,
  Popup,
  Visibility,
  Icon as SemIcon,
  Button,
  Message,
  Input
} from "semantic-ui-react";
import { Query } from "react-apollo";
import { contents, MODES } from "./../../components/widgets";
import AntButton from "antd/lib/button";
import { LAST_DRAFT, PUBLISH_POST } from "../../gql-schemas";
import CreatePostContext from "../../contexts/CreatePost";
import ErrorContext from "../../contexts/ErrorContext";
import Responsive from "../../contexts/Responsive";
import PostWidgetContext from "../../contexts/PostWidgetContext";
import LayoutContext from "./../../contexts/LayoutContext";
import get from "lodash/get";
import last from "lodash/last";
import debounce from "lodash/debounce";
import ContentDropdown from "./ContentDropdown";
import ContentEditor from "./ContentEditor";
import "./create-post.css";

function ContentBlock(props) {
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
  } = props;
  const Content = contents[contentKey].component;
  const style = { paddingLeft: 15, paddingRight: 15, margin: 0 };
  if (!active) {
    style.cursor = "pointer";
  }
  return (
    <Segment
      basic
      onClick={onClick}
      style={style}
      className={active ? "content-active" : "content-inactive"}
    >
      <Content mode={MODES.VIEW} defaultValues={defaultValues} basic fitted />
    </Segment>
  );
}

const TitleEditor = React.memo(({ title, refNo }) => {
  const { editPost } = useContext(CreatePostContext.Context);
  const error = useContext(ErrorContext.Context);
  console.log("render title");

  return (
    <Input
      key={refNo}
      size="big"
      fluid
      defaultValue={title}
      label={{ basic: true, content: "Title" }}
      style={{
        borderBottomStyle: "double",
        borderColor: "gainsboro"
      }}
      placeholder="What is this about?"
      onChange={debounce((_, { value }) => {
        error.clear(PUBLISH_POST.key);
        editPost({ _refNo: refNo, title: value });
      }, 1000)}
    />
  );
});

function useContentSelector(post) {
  const {
    currentContent,
    defaultContentCode,
    setCurrentContent,
    submitWidgetsFn
  } = useContext(PostWidgetContext.Context);
  const hasSelectedContent = useMemo(() => {
    post.widgets.find(widget => {
      return widget.code === get(currentContent, "code");
    });
  }, post.widgets);
  console.log("hasSelectedContent"); //TRACE
  console.log(hasSelectedContent); //TRACE
  useEffect(
    () => {
      if (!hasSelectedContent) {
        console.log("need select");
        const lastWidget = last(post.widgets);
        if (!lastWidget) {
          // if (defaultContentCode)
          //   submitWidgetsFn(
          //     [
          //       {
          //         code: get(currentContent, "code", defaultContentCode),
          //         postRefNo: post._refNo,
          //         values: {}
          //       }
          //     ],
          //     { newWidget: true }
          //   );
        } else {
          console.log("setting last current", lastWidget);
          setCurrentContent(lastWidget);
        }
      }
    },
    [post]
  );
  useEffect(
    () => {
      console.log("postwww"); //TRACE
      console.log(post); //TRACE
      const lastWidget = last(post.widgets);
      if (!lastWidget) {
        if (defaultContentCode)
          submitWidgetsFn(
            [
              {
                code: get(currentContent, "code", defaultContentCode),
                postRefNo: post._refNo,
                values: {}
              }
            ],
            { newWidget: true }
          );
      } else {
        console.log("setting last current", lastWidget);
        setCurrentContent(lastWidget);
      }
    },
    [!hasSelectedContent]
  );
}

const ContentList = React.memo(({ post }) => {
  const { isMobile } = useContext(Responsive.Context);
  const {
    currentContent,
    defaultContentCode,
    setCurrentContent,
    submitWidgetsFn,
    submitting
  } = useContext(PostWidgetContext.Context);
  useContentSelector(post);
  const contents = post.widgets || [];
  console.log("currentContent"); //TRACE
  console.log(currentContent); //TRACE

  return (
    <>
      {contents.map((content, ii) => (
        <ContentBlock
          mobile={isMobile}
          key={ii}
          index={ii}
          _refNo={content._refNo}
          postRefNo={post._refNo}
          contentKey={content.code}
          defaultValues={content.values}
          active={get(currentContent, "_refNo") === content._refNo}
          onUpdated={values => {}}
          // onClose={() => setActiveIndex(null)}
          onClick={() => setCurrentContent(content)}
        />
      ))}
      {/* {contents &&
        contents.length === 0 &&
        submitting && (
          <Message icon compact style={{ marginTop: 0 }}>
            <SemIcon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Just one second</Message.Header>
              Generating your content..
            </Message.Content>
          </Message>
        )} */}
    </>
  );
});

function NewContent({ post }) {
  const {
    currentContent,
    defaultContentCode,
    submitting,
    contentKeys,
    submitWidgetsFn
  } = useContext(PostWidgetContext.Context);

  return (
    <Segment basic className="add-content">
      <center>
        <AntButton
          icon="plus"
          size="large"
          type="dashed"
          loading={submitting}
          onClick={() => {
            submitWidgetsFn(
              [
                {
                  code: get(
                    currentContent,
                    "code",
                    defaultContentCode || contentKeys[0]
                  ),
                  postRefNo: post._refNo,
                  values: {}
                }
              ],
              { newWidget: true }
            );
          }}
        >
          {`Add ${currentContent ? "More" : ""} Content`}
        </AntButton>
      </center>
    </Segment>
  );
}

function ContentEditorWrapper({ post, contentEditorSize }) {
  const [state, setState] = useState({
    height: 0,
    lastUpdate: Date.now()
  });
  const sizeChanged = useCallback(calculations => {
    const curTime = Date.now();
    if (curTime - state.lastUpdate > 1000)
      setState({
        height: calculations.height,
        lastUpdate: curTime
      });
  });
  return (
    <>
      <ContentEditor
        post={post}
        size={contentEditorSize}
        onSizeChanged={sizeChanged}
      />
      <Divider hidden style={{ minHeight: state.height }} />
    </>
  );
}

function ParentPost({ refNo }) {
  return null;
}

export default function PostEditor({ post }) {
  // const { activeIndex, setActiveIndex } = useState(getLastWidgetIndex(post));
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { windowSize, contentStyle } = useContext(LayoutContext.Context);
  function handleOnScreen(e, { calculations }) {
    if (
      calculations.height === size.height &&
      calculations.width === size.width
    )
      return;
    setSize({ width: calculations.width, height: calculations.height });
  }
  console.log("post"); //TRACE
  console.log(post); //TRACE
  console.log("renderall");

  const isReply = !!post.parentPostRefNo;
  const contentEditorSize = { width: size.width };
  const pageContentHeight = windowSize.height - contentStyle.paddingTop;
  if (pageContentHeight < 150) {
    // contentEditorSize.height = pageContentHeight - 150 - size.height;
  }
  return (
    <Container>
      <Visibility
        fireOnMount
        onUpdate={
          size.width > 0 ? debounce(handleOnScreen, 500) : handleOnScreen
        }
        // onUpdate={debounce(handleOnScreen, size.width > 0 ? 1000 : 0)}
      >
        <div
          style={{
            padding: 0,
            // minHeight: windowSize.height - contentStyle.paddingTop,
            border: "#00000017 solid 1px",
            borderTop: "none",
            borderBottom: "none"
          }}
        >
          {isReply ? (
            <ParentPost refNo={post.parentPostRefNo} />
          ) : (
            <TitleEditor title={post.title} refNo={post._refNo} />
          )}
          <ContentList post={post} />
          <NewContent post={post} />
          <ContentEditorWrapper
            post={post}
            contentEditorSize={contentEditorSize}
          />
        </div>
      </Visibility>
    </Container>
  );
}
