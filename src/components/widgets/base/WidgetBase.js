import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Segment, Message } from 'semantic-ui-react';
import { UPDATE_POST_WIDGETS } from '../../../gql-schemas';
import './WidgetBase.css';
import { fromJS } from 'immutable';
import ErrorContext from '../../../contexts/ErrorContext';
import PostWidgetContext from '../../../contexts/PostWidgetContext';

const Preview = ({ ownProps, view: View, compact: Compact }) => (
  <>
    <div className="widget-preview">
      <center>
        <Segment raised style={{ maxWidth: 500 }}>
          <View {...ownProps} />
        </Segment>
      </center>
    </div>
  </>
);

function Editor(props) {
  const {
    values,
    editor: EditorComponent,
    onValuesChanged,
    _refNo,
    context,
    error,
    code,
    name,
    postRefNo,
    children
  } = props;
  const [editValues, setEditValues] = React.useState(values);

  React.useEffect(
    () => {
      setEditValues(values);
    },
    [values]
  );
  const editValuesMap = fromJS(values || {}).mergeDeep(editValues || {});
  const actions = {
    cancel: async () => {
      if (context.submitting) return;
      context.reset();
    },
    save: async newValues => {
      if (context.submitting) return;
      const editValuesObj = newValues || editValuesMap.toJS();
      if (editValuesObj) {
        error.clear(UPDATE_POST_WIDGETS.key);
        const ret = await context.submitWidgetsFn([
          {
            _refNo,
            code,
            name,
            values: editValuesObj,
            postRefNo
          }
        ]);
        return ret;
      }
    }
  };
  return (
    <>
      <EditorComponent
        _refNo={_refNo}
        defaultValues={values}
        updateValues={newValues => {
          const newEditValues = editValuesMap.mergeDeep(fromJS(newValues)).toJS();
          setEditValues(newEditValues);
          onValuesChanged && onValuesChanged(newEditValues);
        }}
        error={error}
        actions={actions}
        submitting={context.submitting}
      />
      {children({
        editValues: editValuesMap.toJS(),
        hello: 'haha'
      })}
    </>
  );
}

function WidgetBase(props) {
  const [state] = useState({ values: undefined, loading: false });

  const {
    code,
    name,
    icon,
    editor,
    view,
    compact,
    shortcut,
    mode = 'view',
    defaultValues,
    onValuesChanged,
    previewData = {},
    preview,
    showPreview = false,
    basic,
    fitted,
    inline,
    shortcutOptions,
    style = {},
    _refNo,
    postRefNo,
    postData,
    loading,
    children
  } = props;

  const error = useContext(ErrorContext.Context);
  const context = useContext(PostWidgetContext.Context);

  const { values } = state;
  let fittedStyle = {};
  if (fitted) {
    fittedStyle = {
      padding: 0,
      marginTop: 0,
      marginBottom: 0
    };
  }
  console.log('renditring');

  let RenderObj;
  switch (mode) {
    case 'compact':
      RenderObj = compact;
      break;
    case 'view':
      RenderObj = view;
      break;
    case 'editor':
      RenderObj = editor;
      break;
    case 'shortcut':
      RenderObj = shortcut || (() => <span />);
      break;
    default:
      RenderObj = () => <span>Empty</span>;
  }

  const ownProps = {
    context,
    _refNo,
    values: values ? values : defaultValues,
    shortcutOptions: mode === 'shortcut' ? shortcutOptions : null,
    code,
    name,
    icon,
    postRefNo,
    postData,
    loading
  };
  if (preview) {
    ownProps.values = previewData;
  }
  const Wrapper = wProps =>
    inline ? (
      <div {...wProps} style={{ display: 'inline' }} />
    ) : (
      <Segment basic={basic} key={code} style={Object.assign(style, fittedStyle)} {...wProps} />
    );
  // const oldValuesHash = JSON.stringify(defaultValues);
  return (
    <Wrapper>
      <>
        {mode !== 'editor' && <RenderObj {...ownProps} />}
        {mode === 'editor' ? (
          <Editor
            {...ownProps}
            editor={editor}
            submitting={context.submitting}
            error={error}
            onValuesChanged={onValuesChanged}
          >
            {({ editValues }) => {
              // const editValuesHash = JSON.stringify(editValues);
              const updateErrors = error[UPDATE_POST_WIDGETS.key];
              // const saved = editValuesHash === oldValuesHash && !updateErrors;
              return (
                <>
                  {showPreview && (
                    <>
                      Preview
                      <Preview ownProps={{ values: editValues }} view={view} compact={compact} />
                    </>
                  )}
                  {!!updateErrors && <Message error content={updateErrors.map(err => err.message)} />}
                </>
              );
            }}
          </Editor>
        ) : (
          children
        )}
      </>
    </Wrapper>
  );
}

WidgetBase.propTypes = {
  code: PropTypes.string.isRequired,
  editor: PropTypes.func.isRequired,
  view: PropTypes.func.isRequired,
  compact: PropTypes.func.isRequired,
  onSave: PropTypes.func
};

export default WidgetBase;
