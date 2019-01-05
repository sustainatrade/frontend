import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { Segment, Label, Divider, Icon as SemIcon, Button, Card, Input } from 'semantic-ui-react';
// import { Query } from 'react-apollo';
import { contents, MODES } from './../../components/widgets';
import AntButton from 'antd/lib/button';
import { PUBLISH_POST, UPDATE_POST_WIDGETS } from '../../gql-schemas';
import CreatePostContext from '../../contexts/CreatePost';
import ErrorContext from '../../contexts/ErrorContext';
import Responsive from '../../contexts/Responsive';
import PostWidgetContext from '../../contexts/PostWidgetContext';
import LayoutContext from './../../contexts/LayoutContext';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import Icon from 'components/icon-provider/Icon';
import Modal from 'antd/lib/modal';
import Drawer from 'antd/lib/drawer';
import ContentEditor from './ContentEditor';

import './create-post.css';
import PostItem from '../post-item';
import ThemeContext from '../../contexts/ThemeContext';
import PopModal from '../../components/pop-modal/Modal';
import PostActions, { ContentSelector } from './PostActions';
import { Spring, animated, config as SpringConfig } from 'react-spring';

function ResetContentButton(props) {
  const [showModal, setShowModal] = React.useState(false);
  const { setCurrentContent, currentContent } = useContext(PostWidgetContext.Context);
  return (
    <>
      <Button
        {...props}
        onClick={() => {
          props.onClick && props.onClick();
          setShowModal(true);
        }}
      />
      {showModal && (
        <PopModal onClose={() => setShowModal(false)}>
          {({ close }) => (
            <ContentSelector
              reset
              onCancel={() => setShowModal(false)}
              onSelect={selectedKey => {
                if (!currentContent) return;
                console.log('currentContent', currentContent); //TRACE
                const newContent = { ...currentContent, code: selectedKey, values: {} };
                setCurrentContent(newContent);
                close();
              }}
            />
          )}
        </PopModal>
      )}
    </>
  );
}

function ContentActions({ contentData }) {
  const { _refNo, code, postRefNo } = contentData;
  const context = useContext(PostWidgetContext.Context);
  const error = useContext(ErrorContext.Context);
  const btnProps = {
    size: 'mini',
    primary: true,
    floated: 'right',
    disabled: context.submitting
  };

  return (
    <div
      className="content-actions"
      onClick={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Button
        icon="trash"
        content="REMOVE"
        {...btnProps}
        onClick={async () => {
          error.clear(UPDATE_POST_WIDGETS.key);
          await context.submitWidgetsFn([
            {
              __deleted: true,
              _refNo,
              code,
              postRefNo
            }
          ]);
        }}
      />
      {/* <Button icon="arrows alternate" {...btnProps} /> */}
      <ResetContentButton content="CHANGE" icon="exchange" {...btnProps} />
      {/* <Button {...btnProps} basic>
        <Iconify {...contentWidget.icon} />
      </Button> */}
    </div>
  );
}

function ContentBlock(props) {
  const { contentKey, active, onClick, defaultValues, _refNo, touched } = props;
  const Content = contents[contentKey].component;
  const style = { padding: 0, margin: 0 };

  if (!active) {
    style.cursor = 'pointer';
  }
  const rgba = a => `rgba(26, 105, 164, ${a})`;
  return (
    <Spring
      key={touched}
      native
      force
      config={SpringConfig.molasses}
      from={{ background: touched ? rgba(1) : rgba(0.0) }}
      to={{ background: rgba(0.0) }}
    >
      {sprops => (
        <animated.div style={sprops}>
          <Segment
            basic
            onClick={onClick}
            style={style}
            className={active ? 'content-active' : 'content-inactive'}
          >
            {active && <ContentActions {...props} />}
            <Content mode={MODES.VIEW} defaultValues={defaultValues} basic fitted />
          </Segment>
        </animated.div>
      )}
    </Spring>
  );
}

const TitleEditor = React.memo(({ title, refNo }) => {
  const { editPost } = useContext(CreatePostContext.Context);
  const error = useContext(ErrorContext.Context);
  console.log('render title');

  return (
    <Input
      key={refNo}
      size="big"
      fluid
      defaultValue={title}
      label={{ basic: true, content: 'Title' }}
      placeholder="What is this about?"
      onChange={debounce((_, { value }) => {
        error.clear(PUBLISH_POST.key);
        editPost({ _refNo: refNo, title: value });
      }, 1000)}
    />
  );
});

const ContentList = React.memo(({ post }) => {
  const { isMobile } = useContext(Responsive.Context);
  const { currentContent, lastTouchKeys, setCurrentContent } = useContext(PostWidgetContext.Context);

  const contents = post.widgets || [];

  return (
    <>
      <Divider hidden />
      {contents.map((savedContent, ii) => {
        const active = get(currentContent, '_refNo') === savedContent._refNo;
        const content = active ? currentContent : savedContent;
        return (
          <ContentBlock
            mobile={isMobile}
            key={ii}
            index={ii}
            _refNo={content._refNo}
            postRefNo={post._refNo}
            contentKey={content.code}
            defaultValues={content.values}
            contentData={content}
            active={active}
            touched={lastTouchKeys.includes(content._refNo)}
            onUpdated={values => {}}
            onClick={() => setCurrentContent(active ? null : content)}
          />
        );
      })}
    </>
  );
});

function ContentEditorWrapper({ post, contentEditorSize, inline }) {
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
  return <ContentEditor post={post} size={contentEditorSize} onSizeChanged={sizeChanged} />;
}

function PostHeader({ post }) {
  console.log('postPheader', post); //TRACE
  const hasParent = !!post.parentPost;
  return hasParent ? (
    <>
      <Segment color="blue" className="reply-parent-post" basic style={{ padding: '0 5px' }}>
        <PostItem isCompact post={post.parentPost} basic withLabels={false} withActions={false} />
      </Segment>
      <Segment inverted color="blue" className="new-reply-header">
        Reply
      </Segment>
    </>
  ) : (
    <TitleEditor title={post.title} refNo={post._refNo} />
  );
}

function InlineWrapper({ children, onCloseConfirm, closing, isReply, isEditting, setClosing, ...rest }) {
  useEffect(
    () => {
      closing && onCloseConfirm();
    },
    [closing]
  );
  return (
    <div {...rest} style={{ marginTop: 10 }}>
      {children}
    </div>
  );
}

function ModalWrapper({ children, setClosing, onCloseConfirm, closing, ...rest }) {
  return (
    <Modal
      visible={!closing}
      afterClose={() => {
        closing && onCloseConfirm();
      }}
      onCancel={() => setClosing(true)}
      footer={null}
      closable={false}
      bodyStyle={{ padding: 0 }}
      {...rest}
    >
      {children}
    </Modal>
  );
}

function DrawerWrapper({
  children,
  className,
  onCloseConfirm,
  closing,
  setClosing,
  isReply,
  isEditting,
  ...rest
}) {
  //FIXME: Improve this
  useEffect(
    () => {
      if (closing) {
        setTimeout(() => {
          onCloseConfirm();
        }, 300);
      }
    },
    [closing]
  );
  return (
    <Drawer
      placement="right"
      className={className}
      closable={false}
      width="100%"
      height="100%"
      style={{ padding: 0 }}
      visible={!closing}
      onClose={onCloseConfirm}
      {...rest}
    >
      <div className="reply-wrap-drawer">
        <div className="reply-wrap-header">
          <Button icon="arrow left" onClick={() => setClosing(true)} />
          {isReply ? 'Create Reply' : `${isEditting ? 'Edit' : 'Create'} Post`}
        </div>
        {children}
      </div>
    </Drawer>
  );
}

export default function PostEditor({ post, inline, extras, onSubmit, onCancel }) {
  // const { activeIndex, setActiveIndex } = useState(getLastWidgetIndex(post));
  const contentRef = useRef(null);
  const actionsRef = useRef(null);
  const [size] = useState({ width: 0, height: 0 });
  // const [contentMaxHeight, setContentMaxHeight] = useState(null);
  const [closing, setClosing] = useState(false);
  const { isMobile } = useContext(Responsive.Context);
  const { windowSize, contentStyle } = useContext(LayoutContext.Context);
  const { mainBgColor } = useContext(ThemeContext.Context);
  // function handleOnScreen(e, { calculations }) {
  //   if (calculations.height === size.height && calculations.width === size.width) return;
  //   setSize({ width: calculations.width, height: calculations.height });
  // }
  console.log('renderall');

  const isReply = !!post.parentPostRefNo;
  const contentEditorSize = { width: size.width };
  const pageContentHeight = windowSize.height - contentStyle.paddingTop;
  if (pageContentHeight < 150) {
    // contentEditorSize.height = pageContentHeight - 150 - size.height;
  }

  // const hasContent = get(post, "widgets", []).length > 0;

  let Wrapper;

  if (isMobile) {
    Wrapper = DrawerWrapper;
  } else if (isReply) {
    Wrapper = ModalWrapper;
  } else {
    Wrapper = InlineWrapper;
  }
  console.log('post', post); //TRACE
  return (
    <div style={{ backgroundColor: mainBgColor }}>
      <Wrapper
        className="post-editor-modal"
        isReply={isReply}
        isEditting={!!post.publishDate}
        closing={closing}
        setClosing={setClosing}
        onCloseConfirm={onCancel}
      >
        {/* <div ref={headerRef} className="reply-wrap-header">
          
        </div> */}
        <div ref={contentRef} style={{ width: '100%' }} className="reply-wrap-body">
          <PostHeader post={post} />
          <ContentList post={post} />
        </div>
        <div ref={actionsRef} style={{ width: '100%' }} className="reply-wrap-actions">
          <PostActions post={post} onSubmit={onSubmit} onCancel={() => setClosing(true)} />
          {extras}
          <ContentEditorWrapper post={post} inline={inline} contentEditorSize={contentEditorSize} />
        </div>
      </Wrapper>
    </div>
  );
}
