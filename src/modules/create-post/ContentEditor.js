import React, { useContext, useState } from 'react';
import { Visibility, Transition } from 'semantic-ui-react';
import './ContentEditor.css';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { contents, MODES } from './../../components/widgets';
import PostWidgetContext from '../../contexts/PostWidgetContext';
import nanoid from 'nanoid';
import hash from 'object-hash';
import { useOnUnmount } from 'react-hanger';

function ContentChangeHandler({ onUpdate }) {
  const { reset, currentContent, setCurrentContent } = useContext(PostWidgetContext.Context);
  useOnUnmount(() => {
    reset();
  });
  React.useEffect(
    () => {
      // only update if code and refno is changed
      onUpdate && onUpdate({ currentContent, setCurrentContent });
    },
    [get(currentContent, 'code'), get(currentContent, '_refNo'), get(currentContent, 'id')]
  );
  return null;
}

const WidgetEditor = React.memo(({ postRefNo }) => {
  const [state, setState] = useState({});
  const { currentContent, setCurrentContent } = state;

  const currentRefNo = get(currentContent, '_refNo');
  let ContentComponent;
  if (currentRefNo) ContentComponent = contents[currentContent.code].component;
  return (
    <div>
      <ContentChangeHandler onUpdate={setState} />
      {currentRefNo && (
        <ContentComponent
          mode={MODES.EDITOR}
          basic
          fitted
          _refNo={currentRefNo}
          postRefNo={postRefNo}
          defaultValues={currentContent.values}
          onValuesChanged={values => {
            console.log('values', values); //TRACE
            if (!values) return;
            const oldHash = hash(currentContent.values || {});
            const newHash = hash(values);
            if (oldHash !== newHash) setCurrentContent({ ...currentContent, values });
          }}
        >
          {() => <div>x</div>}
        </ContentComponent>
      )}
    </div>
  );
});

const WidgetHeader = () => {
  const { currentContent, defaultContentCode } = useContext(PostWidgetContext.Context);

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
  const [vKey, setVKey] = useState(null);
  // if (!currentContent) return null;

  const handleOnScreen = debounce((e, { calculations }) => {
    onSizeChanged && onSizeChanged(calculations);
  }, 500);

  const ceActionStyles = {};
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
          <WidgetHeader />
          <div className="content-editor-controls">
            <WidgetEditor postRefNo={post._refNo} />
          </div>
        </Visibility>
      </div>
    </Transition>
  );
}
