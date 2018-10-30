import React from "react";
import PropTypes from "prop-types";
import {
  Segment,
  Header,
  Label,
  Divider,
  Button,
  Message
} from "semantic-ui-react";
import Icon from "antd/lib/icon";
import AntButton from "antd/lib/button";
import { MODES } from "./../index";
import { UPDATE_POST_WIDGETS } from "../../../gql-schemas";
import { GlobalConsumer } from "../../../contexts";
import "./WidgetBase.css";

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
      children
    } = this.props;
    const { editValues } = this.state;
    return (
      <>
        <EditorComponent
          defaultValues={values}
          updateValues={newValues => {
            const newEditValues = Object.assign(
              {},
              values || {},
              editValues,
              newValues
            );
            this.setState({ editValues: newEditValues });
            onValuesChanged && onValuesChanged(newEditValues);
          }}
        />
        {children({
          editValues: Object.assign(values || {}, editValues || {}),
          hello: "haha"
        })}
      </>
    );
  }
}

class WidgetBase extends React.Component {
  state = { values: undefined, loading: false };

  // shouldComponentUpdate(nextProps) {
  //   const { defaultValues } = this.props;
  //   return nextProps.defaultValues !== defaultValues;
  // }

  render() {
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
      basic,
      fitted,
      style = {},
      _refNo,
      postRefNo,
      children
    } = this.props;
    const { values, loading, saved } = this.state;
    let fittedStyle = {};
    if (fitted) {
      fittedStyle = {
        padding: 0,
        marginTop: 5,
        marginBottom: 5
      };
    }

    return (
      <Segment
        basic={basic}
        key={code}
        style={Object.assign(style, fittedStyle)}
      >
        {mode === MODES.COMPACT && (
          <AntButton size="small" style={{ float: "left", marginRight: 5 }}>
            <Icon {...icon} />
          </AntButton>
        )}
        {/* <Header>
            {mode === MODES.EDITOR && (
              <Icon type="edit" theme="twoTone" style={{ marginRight: 5 }} />
            )}
            <Icon {...icon} /> {name}
          </Header> */}
        <GlobalConsumer>
          {({ error, widget: context }) => {
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
              values: values ? values : defaultValues
            };
            if (preview) {
              ownProps.values = previewData;
            }

            const oldValuesHash = JSON.stringify(defaultValues);
            return (
              <>
                {mode !== "editor" && <RenderObj {...ownProps} />}
                {mode === "editor" && children ? (
                  <Editor
                    {...ownProps}
                    editor={editor}
                    // onValuesChanged={onValuesChanged}
                  >
                    {({ editValues }) => {
                      const editValuesHash = JSON.stringify(editValues);
                      const updateErrors = error[UPDATE_POST_WIDGETS.key];
                      const saved =
                        editValuesHash === oldValuesHash && !updateErrors;
                      return (
                        <>
                          Preview
                          <Preview
                            ownProps={{ values: editValues }}
                            view={view}
                            compact={compact}
                          />
                          {!!updateErrors && (
                            <Message
                              error
                              content={updateErrors.map(err => err.message)}
                            />
                          )}
                          <Button
                            icon="trash"
                            size="small"
                            floated="right"
                            color="red"
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
                          <Button
                            content={saved ? "Saved" : "Save"}
                            icon={saved ? "check" : "save"}
                            size="small"
                            loading={context.submitting}
                            disabled={saved}
                            color="green"
                            floated="right"
                            onClick={async () => {
                              // await apolloClient.
                              console.log("values"); //TRACE
                              console.log(editValues); //TRACE
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
                                this.setState({ saved: true });
                              }
                            }}
                          />
                          {children({ save: () => this.save(), hello: "haha" })}
                          <Divider hidden />
                        </>
                      );
                    }}
                  </Editor>
                ) : (
                  children
                )}
              </>
            );
          }}
        </GlobalConsumer>
      </Segment>
    );
  }
}

WidgetBase.propTypes = {
  code: PropTypes.string.isRequired,
  editor: PropTypes.func.isRequired,
  view: PropTypes.func.isRequired,
  compact: PropTypes.func.isRequired,
  onSave: PropTypes.func
};

export default WidgetBase;
