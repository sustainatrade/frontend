import React from "react";
import PropTypes from "prop-types";
import { Segment, Header, Label, Divider, Button } from "semantic-ui-react";
import Icon from "antd/lib/icon";
import { MODES } from "./../index";
import PostWidgetContext from "../../../contexts/WidgetContext";
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
      style,
      _refNo,
      postRefNo,
      children
    } = this.props;
    const { values, loading, saved } = this.state;
    return (
      <Segment basic={basic} key={code} style={style}>
        {mode === MODES.COMPACT ? (
          <Label basic style={{ float: "right" }}>
            <Icon {...icon} />
            {`  ${name}`}
          </Label>
        ) : (
          <Header>
            {mode === MODES.EDITOR && (
              <Icon type="edit" theme="twoTone" style={{ marginRight: 5 }} />
            )}
            <Icon {...icon} /> {name}
          </Header>
        )}
        <PostWidgetContext.Consumer>
          {context => {
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
                      const saved = editValuesHash === oldValuesHash;
                      return (
                        <>
                          <Preview
                            ownProps={{ values: editValues }}
                            view={view}
                            compact={compact}
                          />
                          <Button
                            icon="trash"
                            size="small"
                            floated="right"
                            color="red"
                            loading={context.submitting}
                            basic
                            onClick={async () => {
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
        </PostWidgetContext.Consumer>
      </Segment>
    );
  }
}

WidgetBase.propTypes = {
  code: PropTypes.string.isRequired,
  editor: PropTypes.func.isRequired,
  view: PropTypes.func.isRequired,
  compact: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default WidgetBase;
