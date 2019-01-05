import React, { useState, useEffect, useContext } from 'react';
import Responsive from '../../contexts/Responsive';
import PostWidgetContext from '../../contexts/PostWidgetContext';
import { Segment, Button, Card, Input } from 'semantic-ui-react';
import Icon from 'components/icon-provider/Icon';
import AntButton from 'antd/lib/button';
import get from 'lodash/get';
import { contents, MODES } from './../../components/widgets';
import { Spring, animated, config as SpringConfig } from 'react-spring';

const TEXT_CONTENT_CODE = 'text';

export function ContentSelector({ post, onSelect, onCancel, reset }) {
  const [selectedKey, setSelectedKey] = useState(null);
  const { setCurrentContent, submitWidgetsFn } = useContext(PostWidgetContext.Context);

  async function createNewContent() {
    if (!post) return;
    const newAdded = await submitWidgetsFn(
      [
        {
          code: selectedKey,
          postRefNo: post._refNo,
          values: {}
        }
      ],
      { newWidget: true }
    );
    setCurrentContent(get(newAdded, '0'));
  }

  async function changeContentType() {
    if (!setCurrentContent) return;
    const newContent = { ...setCurrentContent, code: selectedKey };
    setCurrentContent(newContent);
  }

  useEffect(
    () => {
      if (!selectedKey) return;
      onSelect && onSelect(selectedKey);
      // if (reset) changeContentType();
      // else createNewContent();
    },
    [selectedKey]
  );

  return (
    <>
      <Segment basic color="olive" inverted>
        Available Contents{' '}
        <Button
          icon="x"
          active
          style={{ marginTop: -7 }}
          floated="right"
          color="olive"
          onClick={() => onCancel && onCancel()}
        />
      </Segment>
      <Segment basic className="content-selector">
        <Card.Group stackable itemsPerRow={3}>
          {Object.keys(contents).map(cKey => {
            const contentData = contents[cKey];
            return (
              <Card
                key={cKey}
                onClick={() => {
                  if (selectedKey) return;
                  setSelectedKey(cKey);
                }}
              >
                <Card.Content>
                  <Card.Header>
                    <Icon {...contentData.icon} />
                    {'  '}
                    {contentData.name}
                  </Card.Header>
                  <Card.Meta>{cKey}</Card.Meta>
                  {/* <Card.Description>
          Steve wants to add you to the group{" "}
          <strong>best friends</strong>
        </Card.Description> */}
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </Segment>
    </>
  );
}

export default function PostActions({ post, onSubmit, onCancel }) {
  const { isMobile } = useContext(Responsive.Context);
  const { currentContent, submitting: updating, submitWidgetsFn, setCurrentContent } = useContext(
    PostWidgetContext.Context
  );

  const [showSelector, setShowSelector] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  useEffect(
    () => {
      setShowSelector(false);
    },
    [currentContent]
  );

  if (currentContent) return null;

  async function addContent(selectedKey) {
    const newAdded = await submitWidgetsFn(
      [
        {
          code: selectedKey,
          postRefNo: post._refNo,
          values: {}
        }
      ],
      { newWidget: true }
    );
    console.log('newAdded', newAdded); //TRACE
    setCurrentContent(get(newAdded, '0'));
  }
  let ContentShortcut;
  const shortcutKey = Object.keys(contents)[0];
  if (shortcutKey) {
    ContentShortcut = contents[shortcutKey].component;
  }
  const showControls = isMobile ? !showSelector : true;
  return (
    <>
      {showControls && (
        <Segment
          basic
          className="add-content"
          style={{ padding: 10, marginBottom: 0, borderTop: '2px solid #bfdbff' }}
        >
          <AntButton
            icon={showSelector ? 'minus-circle' : 'plus'}
            size="large"
            type="dashed"
            style={{ padding: '0 15px', marginRight: 5 }}
            loading={updating}
            onClick={() => {
              setShowSelector(!showSelector);
            }}
          >
            {/* {isMobile ? (showSelector ? `Close` : `Add`) : showSelector ? `Close Selector` : `Add Content`} */}
          </AntButton>
          <ContentShortcut mode="shortcut" postRefNo={post._refNo} basic fitted inline />
          {/* <Input
            placeholder="Write something.."
            loading={updating}
            style={{ height: 40, marginLeft: 10 }}
            onClick={() => {
              addContent(TEXT_CONTENT_CODE);
            }}
          /> */}
        </Segment>
      )}
      <Spring
        native
        force
        from={{ height: 0, overflowY: 'hidden' }}
        to={{ height: showSelector ? 'auto' : 0 }}
      >
        {props => (
          <animated.div style={props}>
            <ContentSelector
              post={post}
              onCancel={() => setShowSelector(false)}
              onSelect={async selectedKey => {
                if (!post) return;
                addContent(selectedKey);
              }}
            />
          </animated.div>
        )}
      </Spring>
    </>
  );
}
