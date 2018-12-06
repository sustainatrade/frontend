import React, { useContext, useState } from 'react';
import { Visibility, Transition } from 'semantic-ui-react';
import './ContentEditor.css';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { contents, MODES } from './../../components/widgets';
import PostWidgetContext from '../../contexts/PostWidgetContext';
import nanoid from 'nanoid';

const WidgetEditor = React.memo(({ postRefNo, context }) => {
  const { currentContent } = context;

  if (!currentContent) return null;

  const ContentComponent = contents[currentContent.code].component;
  const currentRefNo = get(currentContent, '_refNo');
  return (
    <div>
      <ContentComponent
        mode={MODES.EDITOR}
        basic
        fitted
        _refNo={currentRefNo}
        postRefNo={postRefNo}
        defaultValues={currentContent.values}
        onValuesChanged={values => {
          // error.clear(PUBLISH_POST.key);
        }}
      >
        {() => <div>x</div>}
      </ContentComponent>
    </div>
  );
});

const WidgetHeader = ({ context }) => {
  const { currentContent, defaultContentCode } = context;

  const code = get(currentContent, 'code', defaultContentCode);
  const selectedContent = contents[code];
  if (!selectedContent) return null;
  return (
    <div className="widget-selector">
      {/* <Button
        floated="right"
        size="mini"
        content="CLOSE"
        basic
        icon="caret down"
        onClick={() => setCurrentContent(null)}
      /> */}
      {/* <span
        style={{
          fontSize: 'x-large',
          color: 'white'
        }}
      >
        {selectedContent.name}
      </span> */}
      {/* <Dropdown
        overlay={menu}
        trigger={["click"]}
        placement="topLeft"
        size="large"
      >
        <AntButton style={{ marginTop: 5 }}>
          <Icon {...selectedContent.icon} />
          {selectedContent.name} <Icon type="down" />
        </AntButton>
      </Dropdown> */}
      {/* <Divider clearing fitted hidden /> */}
    </div>
  );
};

export default function({ post, size, onSizeChanged }) {
  const context = useContext(PostWidgetContext.Context);
  const [vKey, setVKey] = useState(null);
  // if (!currentContent) return null;

  const handleOnScreen = debounce((e, { calculations }) => {
    onSizeChanged && onSizeChanged(calculations);
  }, 500);

  const ceActionStyles = {};
  // const ceActionStyles = { width: size.width, minHeight: size.height };
  // if (isMobile) {
  //   ceActionStyles.width = "100%";
  //   ceActionStyles.left = 0;
  // }
  return (
    <Transition
      visible
      animation="fade up"
      duration={500}
      onComplete={() => {
        setVKey(nanoid());
      }}
    >
      <div className="content-editor-actions" style={ceActionStyles}>
        <Visibility key={vKey} fireOnMount continuous updateOn="repaint" onUpdate={handleOnScreen}>
          <WidgetHeader context={context} />
          <div className="content-editor-controls">
            <WidgetEditor postRefNo={post._refNo} context={context} />
          </div>
        </Visibility>
      </div>
    </Transition>
  );
}
