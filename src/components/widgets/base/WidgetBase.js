import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import {
  Segment,
  Header,
  Label,
  Divider,
  Button,
  Message
} from "semantic-ui-react";
import AntButton from "antd/lib/button";
import { MODES } from "./../index";
import { UPDATE_POST_WIDGETS } from "../../../gql-schemas";
import { GlobalConsumer } from "../../../contexts";
import "./WidgetBase.css";
import { fromJS } from "immutable";
import ErrorContext from "../../../contexts/ErrorContext";
import PostWidgetContext from "../../../contexts/PostWidgetContext";

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

class Editor extends React.Component {
  state = { editValues: undefined };
  componentDidMount() {
    this.setState({ editValues: this.props.values });
  }
  render() {
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
    } = this.props;
    const { editValues } = this.state;
    const editValuesMap = fromJS(values || {}).mergeDeep(editValues || {});
    const actions = {
      save: async () => {
        if (context.submitting) return;
        const editValuesObj = editValuesMap.toJS();
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
            const newEditValues = editValuesMap
              .mergeDeep(fromJS(newValues))
              .toJS();
            this.setState({ editValues: newEditValues });
            onValuesChanged && onValuesChanged(newEditValues);
          }}
          error={error}
          actions={actions}
          submitting={context.submitting}
        />
        {children({
          editValues: editValuesMap.toJS(),
          hello: "haha"
        })}
      </>
    );
  }
}

function WidgetBase(props) {
  const [state, setState] = useState({ values: undefined, loading: false });

  const {
    code,
    name,
    icon,
    editor,
    view,
    compact,
    mode = "view",
    defaultValues,
    onValuesChanged,
    previewData = {},
    preview,
    showPreview = false,
    basic,
    fitted,
    style = {},
    _refNo,
    postRefNo,
    children
  } = props;

  const error = useContext(ErrorContext.Context);
  const context = useContext(PostWidgetContext.Context);

  const { values } = state;
  let fittedStyle = {};
  if (fitted) {
    fittedStyle = {
      padding: 0,
      marginTop: 5,
      marginBottom: 5
    };
  }
  console.log("renditring");

  let RenderObj;
  switch (mode) {
    case "compact":
      RenderObj = compact;
      break;
    case "view":
      RenderObj = view;
      break;
    case "editor":
      RenderObj = editor;
      break;
    default:
      RenderObj = () => <span>Empty</span>;
  }

  const ownProps = {
    context,
    _refNo,
    values: values ? values : defaultValues,
    code,
    name,
    icon,
    postRefNo
  };
  if (preview) {
    ownProps.values = previewData;
  }

  const oldValuesHash = JSON.stringify(defaultValues);
  return (
    <Segment basic={basic} key={code} style={Object.assign(style, fittedStyle)}>
      <>
        {mode !== "editor" && <RenderObj {...ownProps} />}
        {mode === "editor" ? (
          <Editor
            {...ownProps}
            editor={editor}
            submitting={context.submitting}
            error={error}
            // onValuesChanged={onValuesChanged}
          >
            {({ editValues }) => {
              const editValuesHash = JSON.stringify(editValues);
              const updateErrors = error[UPDATE_POST_WIDGETS.key];
              const saved = editValuesHash === oldValuesHash && !updateErrors;
              return (
                <>
                  {showPreview && (
                    <>
                      Preview
                      <Preview
                        ownProps={{ values: editValues }}
                        view={view}
                        compact={compact}
                      />
                    </>
                  )}
                  {!!updateErrors && (
                    <Message
                      error
                      content={updateErrors.map(err => err.message)}
                    />
                  )}
                  {/* <Button
                    content={
                      <>
                        <Icon {...icon} />
                        {saved ? " Saved" : ` Preview ${name}`}
                      </>
                    }
                    size="large"
                    loading={context.submitting}
                    disabled={saved}
                    color="green"
                    onClick={async () => {
                      if (editValues) {
                        error.clear(UPDATE_POST_WIDGETS.key);
                        await context.submitWidgetsFn([
                          {
                            _refNo,
                            code,
                            name,
                            values: editValues,
                            postRefNo
                          }
                        ]);
                        setState({ saved: true });
                      }
                    }}
                  />

                  <Button
                    icon="trash"
                    size="large"
                    color="red"
                    // content="Remove"
                    loading={context.submitting}
                    basic
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
                  <Divider hidden /> */}
                </>
              );
            }}
          </Editor>
        ) : (
          children
        )}
      </>
    </Segment>
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
